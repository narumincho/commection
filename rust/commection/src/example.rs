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

pub trait Evaluable<T> {
    fn evaluate<I: Impliment>(&self) -> T;
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
}
