mod example;
mod simpleHttpType;

pub struct Server<ImplementType, RequestExpr> {
    pub schema: Schema<ImplementType, RequestExpr>,
    pub implementation: ImplementType,
}

pub struct Schema<ImplementType, RequestExpr> {
    pub name: String,
    implement_type: std::marker::PhantomData<ImplementType>,
    request_expr: std::marker::PhantomData<RequestExpr>,
}
