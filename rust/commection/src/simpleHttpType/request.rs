use super::url::SimpleUrl;

pub enum SimpleRequest {
    Get(SimpleRequestGet),
    Option(SimpleRequestOption),
    Post(SimpleRequestPost),
}

pub struct SimpleRequestGet {
    pub url: SimpleUrl,
}

pub struct SimpleRequestOption {
    pub url: SimpleUrl,
}

pub struct SimpleRequestPost {
    pub url: SimpleUrl,
    pub header: SimpleRequestHeader,
    pub body: once_cell::sync::Lazy<serde_json::Value>,
}

pub struct SimpleRequestHeader {
    pub authorization_bearer_value: Option<String>,
}
