/// Structured, read-only URLs
/// where you don't have to worry about Trailing Slash or anything else
pub struct SimpleUrl {
    pub origin: String,
    pub path_segments: Vec<non_empty_string::NonEmptyString>,
    pub query: std::collections::HashMap<non_empty_string::NonEmptyString, String>,
}
