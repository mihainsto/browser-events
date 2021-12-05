export interface BrowserRecords {
    records: Record[];
}

export interface Record {
    event: Event;
    setup: Setup;
    time:  number;
}

export interface Event {
    type: string;
}

export enum Type {
    Click = "click",
    ExplicitClick = "explicitClick",
    Focus = "focus",
    Input = "input",
    Navigate = "navigate",
}

export interface Setup {
    attributes?:   Attributes;
    description?:  string;
    name?:         string;
    type?:         null;
    url?:          string;
    altPath?:      string;
    altSelector?:  string;
    computedRole?: null | string;
    frame?:        string;
    frame_id?:     string;
    html?:         string;
    nodeName?:     string;
    nodeType?:     number;
    rootpath?:     string;
    selector?:     string;
    xpath?:        string;
    maxLength?:    number;
    minLength?:    number;
    pattern?:      string;
    required?:     boolean;
    value?:        string;
}

export interface Attributes {
    title?:                        string;
    autofocus?:                    string;
    class?:                        string;
    id?:                           string;
    name?:                         string;
    placeholder?:                  string;
    "rcrdr-extra-style"?:          RcrdrExtraStyle;
    required?:                     Required;
    type?:                         DataValidationName;
    "data-sc-fieldtype"?:          string;
    "data-sc-fieldtype-id"?:       string;
    "data-target"?:                string;
    pattern?:                      string;
    "data-action"?:                string;
    value?:                        string;
    "data-validation-name"?:       DataValidationName;
    "data-behavior"?:              string;
    "data-appearing-on"?:          string;
    "data-bucket-id"?:             string;
    "data-bucket-url"?:            string;
    tabindex?:                     string;
    "data-role"?:                  string;
    "data-disable-with"?:          string;
    "aria-haspopup"?:              string;
    "aria-label"?:                 string;
    href?:                         string;
    role?:                         string;
    alt?:                          string;
    "data-current-person-avatar"?: string;
    height?:                       string;
    src?:                          string;
    srcset?:                       string;
    width?:                        string;
}

export enum DataValidationName {
    Checkbox = "checkbox",
    Email = "email",
    Password = "password",
    Submit = "submit",
    Text = "text",
}

export interface RcrdrExtraStyle {
    display:    Display;
    visibility: Visibility;
}

export enum Display {
    Block = "block",
    Inline = "inline",
    InlineBlock = "inline-block",
}

export enum Visibility {
    Visible = "visible",
}

export enum Required {
    Required = "required",
}
