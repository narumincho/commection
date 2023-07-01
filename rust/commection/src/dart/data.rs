#[derive(Debug, Clone, PartialEq)]
pub enum Operator {
    NullishCoalescing,
    NotEqual,
    Equal,
    Add,
    LogicalAnd,
}
