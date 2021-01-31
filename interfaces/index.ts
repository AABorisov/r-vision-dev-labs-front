export type CategoryType = {
    id: number;
    name: string;
    color: string;
};

export type SelectCategory = {
    id: number;
    indexWords: Array<number>;
    type: CategoryType;
};

export type File = {
    words: Array<string>;
    selectWords: Array<SelectCategory>;
};

export type IRecognizedTableRow = {
    key: number;
    document_id: number;
    cve: string;
    cwe: string;
    software: string;
    malware: string;
    course_of_action: string;
    intrusion_set: string;
    threat_actor: string;
    tool: string;
    attack_pattern: string;
    industry: string;
    mitre_attack: string;
    campaign: string;
    org: string;
    country: string;
    city: string;
    geolocation: string;
    time_stamp: string;
    ioc: string;
    technique: string;
};

export type IUploadedTableRow = {
    key: number;
    id: number;
    document: string;
    category: string;
    author: string;
    creationDate: string;
};

export type INlpTableRow = {
    key: string;
    attribute_name: string;
    attribute_value: string | number;
    status: number;
    nlp_id: number;
};
