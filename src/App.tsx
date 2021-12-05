import React, { useEffect, useState, FC } from 'react';
import './App.css';
import { BrowserRecords } from './types/browserRecords.type'
import axios from 'axios';
import { Card, CardContent, Typography, CardActions, Button, Input } from '@mui/material';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from 'lodash';

import format from 'date-fns/format'

//@ts-ignore
function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  //@ts-ignore
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    //@ts-ignore
    window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

type CusotomCardContentProps = {
  item: BrowserRecords['records'][0]
}
const CustomCardContent: FC<CusotomCardContentProps> = ({ item }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Event Type:
        </Typography>
        <Typography variant="h5" component="div" color="secondary">
          {item.event.type}
        </Typography>
      </div>

      {item.setup.nodeName &&
        <div>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            HTML Tag Name:
          </Typography>
          <Typography variant="h5" component="div" color="secondary">
            {item.setup.nodeName}
          </Typography>
        </div>
      }
      <div>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          DateTime
        </Typography>
        <Typography variant="h5" component="div" color="secondary">
          {format(new Date(item.time), 'MM/dd/yyyy m:s')}
        </Typography>
      </div>

    </div>
  )
}

type EditModeCardContentProps = {
  item: BrowserRecords['records'][0]
  onDateUpdated: (newDate: Date) => void
  onTypeUpdated: (newType: string) => void
  onNodeNameUpdated: (newNodeName: string) => void
}
const EditModeCardContent: FC<EditModeCardContentProps> = ({ item, onDateUpdated, onTypeUpdated, onNodeNameUpdated }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Event Type:
        </Typography>
        <Input defaultValue={item.event.type}
          onBlur={(e) => { onTypeUpdated(e.target.value) }}
        />
      </div>

      {item.setup.nodeName &&
        <div>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            HTML Tag Name:
          </Typography>
          <Input defaultValue={item.setup.nodeName}
            onBlur={(e) => { onNodeNameUpdated(e.target.value) }} />
        </div>
      }
      <div>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          DateTime
        </Typography>
        <Typography variant="h5" component="div" color="secondary">
          <div>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              value={new Date(item.time)}
              onChange={(newValue) => {
                console.log({ newValue })
                if (newValue)
                  onDateUpdated(newValue)
              }}
            />
          </div>
        </Typography>
      </div>

    </div>
  )
}


function App() {
  const [data, setData] = useState<BrowserRecords['records'] | null>(null)
  const [editModeCardIndex, setEditModeCardIndex] = useState<number | null>(null)
  const [countsOfDifferentEventTypes, setCountsOfDifferentEventTypes] = useState<any | null>(null)
  const [minTimeDelay, setMinTimeDelay] = useState<number | null>(null)
  const [maxTimeDelay, setMaxTimeDelay] = useState<number | null>(null)
  const [meanTimeDelay, setMeanTimeDelay] = useState<number | null>(null)
  const [longestSequece, setLongestSequece] = useState<number | null>(null)
  const [totalTime, setTotalTime] = useState<number | null>(null)

  useEffect(() => {
    axios
      .get('rawData.json', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      })
      .then((res) => {
        setData(res.data.records)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [])


  if (!data) {
    return <div>
      loading
    </div>
  }

  const calcCountsOfEventType = () => {
    const cleanedArray = data.map((item) => item.event.type)
    console.log({ cleanedArray })
    const counts = _.countBy(cleanedArray)
    console.log({ counts })
    setCountsOfDifferentEventTypes(counts)
  }

  const calcTimeDelay = () => {
    const timeArray = data.map((item) => item.time)
    timeArray.sort()
    let minDelay = timeArray[1] - timeArray[0]
    let maxDelay = timeArray[1] - timeArray[0]
    const delayArr = []
    let delaySum = 0
    let delayCount = 0

    for (let i = 0; i < timeArray.length - 1; i++) {
      const thisDelay = timeArray[i + 1] - timeArray[i]
      if (minDelay > thisDelay) minDelay = thisDelay
      if (maxDelay < thisDelay) maxDelay = thisDelay
      delayArr.push(thisDelay)
      delaySum += thisDelay
      delayCount += 1
    }

    setMinTimeDelay(minDelay)
    setMaxTimeDelay(minDelay)
    setMeanTimeDelay(delaySum / delayCount)
    setTotalTime(delaySum)
  }

  const calcLongestSequence = () => {
    const cleanedArray = data.map((item) => {
      if (item.event.type !== 'input') return {
        time: item.time,
        event: item.event
      }
    })
    cleanedArray.filter(Boolean)
    //@ts-ignore
    cleanedArray.sort((a, b) => a?.time < b?.time)

    let best = 0
    let prevLong = 0
    let prev: null | string = null
    cleanedArray.map((e) => {
      if (prev !== e?.event.type) {
        prevLong = 0
      } else {
        prevLong += 1
      }

      prev = e?.event.type as string
      if (best < prevLong)
        best = prevLong
    })

    setLongestSequece(best)
  }

  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center' }}>
      <div>
        <LocalizationProvider dateAdapter={AdapterDateFns}>

          <div style={{ marginBottom: 100 }}>
            <div style={{display: 'flex', gap: 40}}>
              <Button onClick={() => {
                calcCountsOfEventType()
                calcTimeDelay()
                calcLongestSequence()
              }}>Calculate Stats</Button>

              <Button onClick={() => {
                download(JSON.stringify({records: data}), 'download', 'json')
              }}>
                Download
              </Button>
            </div>

            {minTimeDelay &&
              <div>
                <Typography>
                  Counts of different event types:
                </Typography>
                <Typography>
                  {JSON.stringify(countsOfDifferentEventTypes)}
                </Typography>
                <Typography>
                  Min time delay: {minTimeDelay}
                </Typography>

                <Typography>
                  Max time delay: {maxTimeDelay}
                </Typography>

                <Typography>
                  Mean time delay: {meanTimeDelay}
                </Typography>

                <Typography>
                  Longest squence of following input events: {longestSequece}
                </Typography>

                <Typography>
                  Total time of the events: {totalTime}
                </Typography>
              </div>
            }
          </div>

          <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 40 }}>
            <DragDropContext onDragEnd={(result) => {
              if (!result.destination) {
                return;
              }
              const list = [...data]
              const startIndex = result.source.index
              const endIndex = result.destination.index
              const [removed] = list.splice(startIndex, 1)
              list.splice(endIndex, 0, removed)
              setData(list)

            }}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 40 }}
                  >

                    {data.map((item, index) => {
                      return (
                        <Draggable key={index} draggableId={index.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <Card>
                                <CardContent>
                                  {editModeCardIndex === index ?
                                    <EditModeCardContent item={item}
                                      onDateUpdated={(date) => {
                                        const newData = [...data]
                                        newData[index].time = new Date(date).getTime()
                                        setData(newData)
                                      }}
                                      onTypeUpdated={(newType) => {
                                        const newData = [...data]
                                        newData[index].event.type = newType
                                        setData(newData)
                                      }}
                                      onNodeNameUpdated={(newNodeName) => {
                                        const newData = [...data]
                                        newData[index].setup.nodeName = newNodeName
                                        setData(newData)
                                      }}
                                    />
                                    :
                                    <CustomCardContent item={item} />

                                  }
                                </CardContent>
                                <CardActions>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div>
                                      <Button size="small" onClick={() => {
                                        if (editModeCardIndex === index) {
                                          setEditModeCardIndex(null)
                                        } else {
                                          setEditModeCardIndex(index)
                                        }
                                      }}>
                                        {editModeCardIndex !== index ? 'Edit' : 'Done'}
                                      </Button>
                                      <Button size="small" onClick={() => {
                                        const newData = [...data]
                                        newData.splice(index, 1)
                                        console.log({ newData })
                                        setData(newData)
                                      }}>
                                        Delete
                                      </Button>
                                    </div>

                                    <div
                                      style={{ marginLeft: 150 }}
                                      {...provided.dragHandleProps}
                                    >
                                      <Typography >
                                        Reorder - Hold
                                      </Typography>
                                    </div>
                                  </div>
                                </CardActions>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </LocalizationProvider>
      </div>
    </div>
  );
}

export default App;
