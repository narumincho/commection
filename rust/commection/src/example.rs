pub enum UntypedRequestExpr {
    Hello(Hello),
    StringLiteral(String),
}

pub struct Hello {}

impl Evaluable for Hello {
    type T = String;

    fn evaluate<I: Impliment>() -> String {
        return <I as Impliment>::hello();
    }
}

pub trait Evaluable {
    type T;
    fn evaluate<I: Impliment>() -> Self::T;
}

pub struct RequestExpr<T> {
    response_type: std::marker::PhantomData<T>,
    expr: UntypedRequestExpr,
}

pub fn hello() -> RequestExpr<String> {
    return RequestExpr {
        response_type: std::marker::PhantomData::<String>,
        expr: UntypedRequestExpr::Hello(Hello {}),
    };
}

pub fn stringLiteral(value: &String) -> RequestExpr<String> {
    return RequestExpr {
        response_type: std::marker::PhantomData::<String>,
        expr: UntypedRequestExpr::StringLiteral(value.clone()),
    };
}

pub trait Impliment {
    fn hello() -> String;
}

#[cfg(test)]
mod tests {
    use crate::example::Evaluable;

    struct TestImpl {}

    impl super::Impliment for TestImpl {
        fn hello() -> String {
            return "ok!!!".to_string();
        }
    }

    #[test]
    fn it_works() {
        let a = super::Hello {};
        let result: String = <super::Hello as Evaluable>::evaluate::<TestImpl>();

        assert_eq!(result, "ok!!!");
    }
}
