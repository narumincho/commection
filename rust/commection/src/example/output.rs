pub struct Hello {}

impl Evaluable<String> for Hello {
    fn evaluate<I: Impliment>(self: &Self) -> String {
        return <I as Impliment>::hello();
    }
}

pub struct TextLiteral {
    pub value: String,
}

impl Evaluable<String> for TextLiteral {
    fn evaluate<I: Impliment>(self: &Self) -> String {
        return self.value.clone();
    }
}

pub struct TextJoin<Left: Evaluable<String>, Right: Evaluable<String>> {
    pub left: Box<Left>,
    pub right: Box<Right>,
}

impl<Left: Evaluable<String>, Right: Evaluable<String>> Evaluable<String>
    for TextJoin<Left, Right>
{
    fn evaluate<I: Impliment>(self: &Self) -> String {
        return self.left.evaluate::<I>() + &self.right.evaluate::<I>();
    }
}

pub struct TextIsEmpty<Expr: Evaluable<String>> {
    pub expr: Box<Expr>,
}

impl<Expr: Evaluable<String>> Evaluable<bool> for TextIsEmpty<Expr> {
    fn evaluate<I: Impliment>(self: &Self) -> bool {
        return *&self.expr.evaluate::<I>().is_empty();
    }
}

pub struct IfExpr<R, Condition: Evaluable<bool>, ThenExpr: Evaluable<R>, ElseExpr: Evaluable<R>> {
    pub condition: Condition,
    pub then_expr: ThenExpr,
    pub else_expr: ElseExpr,
    pub r_type: std::marker::PhantomData<R>,
}

impl<R, Condition: Evaluable<bool>, ThenExpr: Evaluable<R>, ElseExpr: Evaluable<R>> Evaluable<R>
    for IfExpr<R, Condition, ThenExpr, ElseExpr>
{
    fn evaluate<I: Impliment>(&self) -> R {
        if self.condition.evaluate::<I>() {
            self.then_expr.evaluate::<I>()
        } else {
            self.else_expr.evaluate::<I>()
        }
    }
}

pub struct OptionalMatch<
    T: Clone,
    R,
    Optional: Evaluable<Option<T>>,
    SomeExprReturn: Evaluable<R>,
    SomeExpr: Fn(Literal<T>) -> SomeExprReturn,
    NoneExpr: Evaluable<R>,
> {
    pub optional: Optional,
    pub some: SomeExpr,
    pub none: NoneExpr,
    pub t_type: std::marker::PhantomData<T>,
    pub r_type: std::marker::PhantomData<R>,
}

pub struct Literal<T: Clone> {
    pub value: T,
}

impl<
        T: Clone,
        R,
        Optional: Evaluable<Option<T>>,
        SomeExprReturn: Evaluable<R>,
        SomeExpr: Fn(Literal<T>) -> SomeExprReturn,
        NoneExpr: Evaluable<R>,
    > Evaluable<R> for OptionalMatch<T, R, Optional, SomeExprReturn, SomeExpr, NoneExpr>
{
    fn evaluate<I: Impliment>(&self) -> R {
        match self.optional.evaluate::<I>() {
            Some(value) => (self.some)(Literal { value }).evaluate::<I>(),
            None => self.none.evaluate::<I>(),
        }
    }
}

impl<T: Clone> Evaluable<T> for Literal<T> {
    fn evaluate<I: Impliment>(&self) -> T {
        self.value.clone()
    }
}

pub trait Evaluable<T> {
    fn evaluate<I: Impliment>(&self) -> T;
}

pub trait Impliment {
    fn hello() -> String;
}

struct Server<I: Impliment> {
    impliment: I,
}

impl<I: Impliment> Server<I> {
    fn evalute<T, E: Evaluable<T>>(expr: E) -> T {
        expr.evaluate::<I>()
    }

    fn handle_request() {}
}

#[cfg(test)]
mod tests {
    use super::Evaluable;

    struct TestImpl {}

    impl super::Impliment for TestImpl {
        fn hello() -> String {
            return "ok!!!".to_string();
        }
    }

    #[test]
    fn text_is_empty() {
        let k = super::TextIsEmpty {
            expr: Box::new(super::TextLiteral {
                value: "".to_string(),
            }),
        };

        let result = k.evaluate::<TestImpl>();

        assert_eq!(result, true);
    }

    #[test]
    fn text_join() {
        let expr = super::TextJoin {
            left: Box::new(super::TextLiteral {
                value: "sample: ".to_string(),
            }),
            right: Box::new(super::Hello {}),
        };

        let result = expr.evaluate::<TestImpl>();

        assert_eq!(result, "sample: ok!!!");
    }

    #[test]
    fn if_true() {
        let expr = super::IfExpr {
            condition: super::TextIsEmpty {
                expr: Box::new(super::TextLiteral {
                    value: "".to_string(),
                }),
            },
            then_expr: super::TextLiteral {
                value: "T".to_string(),
            },
            else_expr: super::TextLiteral {
                value: "F".to_string(),
            },
            r_type: std::marker::PhantomData {},
        };

        let result = expr.evaluate::<TestImpl>();

        assert_eq!(result, "T");
    }

    #[test]
    fn if_false() {
        let expr = super::IfExpr {
            condition: super::TextIsEmpty {
                expr: Box::new(super::TextLiteral {
                    value: "aa".to_string(),
                }),
            },
            then_expr: super::TextLiteral {
                value: "T".to_string(),
            },
            else_expr: super::TextLiteral {
                value: "F".to_string(),
            },
            r_type: std::marker::PhantomData {},
        };

        let result = expr.evaluate::<TestImpl>();

        assert_eq!(result, "F");
    }

    #[test]
    fn optional_match() {
        let expr = super::OptionalMatch {
            optional: super::Literal {
                value: Some("aa".to_string()),
            },
            some: |value| super::TextJoin {
                left: Box::new(super::Literal {
                    value: "Some(".to_string(),
                }),
                right: Box::new(value),
            },
            none: super::TextLiteral {
                value: "None".to_string(),
            },
            t_type: std::marker::PhantomData {},
            r_type: std::marker::PhantomData {},
        };

        let result = expr.evaluate::<TestImpl>();

        assert_eq!(result, "Some(aa");
    }
}
