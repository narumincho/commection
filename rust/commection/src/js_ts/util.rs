use super::data::*;
use super::identifier;

/// プロパティの値を取得する。getByExprのシンタックスシュガー
pub fn get(expr: Expr, property_name: &str) -> Expr {
    Expr::Get(Box::new(GetExpr {
        expr,
        property_expr: Expr::StringLiteral(String::from(property_name)),
    }))
}

/// メソッドを呼ぶ (getとcallのシンタックスシュガー)
pub fn call_method(expr: Expr, method_name: &str, parameter_list: Vec<Expr>) -> Expr {
    Expr::Call(Box::new(CallExpr {
        expr: get(expr, method_name),
        parameter_list,
    }))
}

/// 単項マイナス演算子 `-a`
pub fn minus(expr: Expr) -> Expr {
    Expr::UnaryOperator(Box::new(UnaryOperatorExpr {
        operator: UnaryOperator::Minus,
        expr,
    }))
}

/// ビット否定 `~a`
pub fn bitwise_not(expr: Expr) -> Expr {
    Expr::UnaryOperator(Box::new(UnaryOperatorExpr {
        operator: UnaryOperator::BitwiseNot,
        expr,
    }))
}

/// 論理否定
/// ```ts
/// !a
/// ```
pub fn logical_not(expr: Expr) -> Expr {
    Expr::UnaryOperator(Box::new(UnaryOperatorExpr {
        operator: UnaryOperator::LogicalNot,
        expr,
    }))
}

/// べき乗
/// ```ts
/// a ** b
/// ```
pub fn exponentiation(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::Multiplication,
        left,
        right,
    }))
}

/// 数値の掛け算
/// ```ts
/// a * b
/// ```
pub fn multiplication(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::Multiplication,
        left,
        right,
    }))
}

/**
 * 数値の割り算 `a / b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn division(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::Division,
        left,
        right,
    }))
}

/**
 * 剰余演算 `a % b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn modulo(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::Remainder,
        left,
        right,
    }))
}

/**
 * 数値の足し算、文字列の結合 `a + b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn addition(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::Addition,
        left,
        right,
    }))
}

/**
 * 数値の引き算 `a - b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn subtraction(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::Subtraction,
        left,
        right,
    }))
}

/**
 * 左シフト `a << b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn left_shift(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::LeftShift,
        left,
        right,
    }))
}

/**
 * 符号を維持する右シフト `a >> b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn signed_right_shift(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::SignedRightShift,
        left,
        right,
    }))
}

/**
 * 符号を維持しない(0埋め)右シフト `a >>> b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn unsigned_right_shift(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::UnsignedRightShift,
        left,
        right,
    }))
}

/**
 * 未満 `a < b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn less_than(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::LessThan,
        left,
        right,
    }))
}

/**
 * 以下 `a <= b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn less_than_or_equal(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::LessThanOrEqual,
        left,
        right,
    }))
}
/**
 * 等号 `a === b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn equal(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::Equal,
        left,
        right,
    }))
}

/**
 * 不等号 `a !== b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn not_equal(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::NotEqual,
        left,
        right,
    }))
}

/**
 * ビットAND `a & b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn bitwise_and(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::BitwiseAnd,
        left,
        right,
    }))
}

/// ビット XOR
/// ```ts
/// a ^ b
/// ```
pub fn bitwise_xor(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::BitwiseXOr,
        left,
        right,
    }))
}

/**
 * ビットOR `a | b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn bitwise_or(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::BitwiseOr,
        left,
        right,
    }))
}

/**
 * 論理AND `a && b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn logical_and(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::LogicalAnd,
        left,
        right,
    }))
}

/**
 * 論理OR `a || b`
 * @param left 左辺
 * @param right 右辺
 */
pub fn logical_or(left: Expr, right: Expr) -> Expr {
    Expr::BinaryOperator(Box::new(BinaryOperatorExpr {
        operator: BinaryOperator::LogicalOr,
        left,
        right,
    }))
}

/**
 * ```ts
 * Number.parseInt(parameter)
 * Number.isNaN(parameter)
 * ```
 */
pub fn call_number_method(module_name: &str, parameter_list: Vec<Expr>) -> Expr {
    call_method(
        Expr::GlobalObjects(identifier::from_string("Number")),
        module_name,
        parameter_list,
    )
}

/**
 * ```ts
 * Math.floor(parameter)
 * Math.sqrt(parameter)
 * ```
 */
pub fn call_math_method(method_name: &str, parameter_list: Vec<Expr>) -> Expr {
    call_method(
        Expr::GlobalObjects(identifier::from_string("Math")),
        method_name,
        parameter_list,
    )
}

/**
 * ```ts
 * new Date()
 * ```
 */
pub fn new_date() -> Expr {
    Expr::New(Box::new(CallExpr {
        expr: Expr::GlobalObjects(identifier::from_string("Date")),
        parameter_list: vec![],
    }))
}

/**
 * ```ts
 * new Uint8Array(lengthOrIterable)
 * ```
 */
pub fn new_uint8array(length_or_iterable: Expr) -> Expr {
    Expr::New(Box::new(CallExpr {
        expr: Expr::GlobalObjects(identifier::from_string("Uint8Array")),
        parameter_list: vec![length_or_iterable],
    }))
}

/**
 * ```ts
 * new Map(initKeyValueList)
 * ```
 */
pub fn new_map(init_key_value_list: Expr) -> Expr {
    Expr::New(Box::new(CallExpr {
        expr: Expr::GlobalObjects(identifier::from_string("Map")),
        parameter_list: vec![init_key_value_list],
    }))
}

/**
 * ```ts
 * new Set(initValueList)
 * ```
 */
pub fn new_set(init_value_list: Expr) -> Expr {
    Expr::New(Box::new(CallExpr {
        expr: Expr::GlobalObjects(identifier::from_string("Set")),
        parameter_list: vec![init_value_list],
    }))
}

/**
 * ```ts
 * console.log(expr)
 * ```
 */
pub fn console_log(expr: Expr) -> Statement {
    Statement::EvaluateExpr(call_method(
        Expr::GlobalObjects(identifier::from_string("console")),
        "log",
        vec![expr],
    ))
}

/**
 * `Array<elementType>`
 */
pub fn array_type(element_type: Type) -> Type {
    Type::WithTypeParameter(Box::new(TypeWithTypeParameter {
        r#type: Type::ScopeInGlobal(identifier::from_string("Array")),
        type_parameter_list: vec![element_type],
    }))
}

/**
 * `ReadonlyArray<elementType>`
 */
pub fn readonly_array_type(element_type: Type) -> Type {
    Type::WithTypeParameter(Box::new(TypeWithTypeParameter {
        r#type: Type::ScopeInGlobal(identifier::from_string("ReadonlyArray")),
        type_parameter_list: vec![element_type],
    }))
}

/**
 * `Uint8Array`
 */
pub fn uint8array_type() -> Type {
    Type::ScopeInGlobal(identifier::from_string("Uint8Array"))
}

/**
 * `Promise<returnType>`
 */
pub fn promise_type(return_type: Type) -> Type {
    Type::WithTypeParameter(Box::new(TypeWithTypeParameter {
        r#type: Type::ScopeInGlobal(identifier::from_string("Promise")),
        type_parameter_list: vec![return_type],
    }))
}

/**
 * `Date`
 */
pub fn date_type() -> Type {
    Type::ScopeInGlobal(identifier::from_string("Date"))
}

/**
 * `Map<keyType, valueType>`
 */
pub fn map_type(key_type: Type, value_type: Type) -> Type {
    Type::WithTypeParameter(Box::new(TypeWithTypeParameter {
        r#type: Type::ScopeInGlobal(identifier::from_string("Map")),
        type_parameter_list: vec![key_type, value_type],
    }))
}

/**
 * `ReadonlyMap<keyType, valueType>`
 */
pub fn readonly_map_type(key_type: Type, value_type: Type) -> Type {
    Type::WithTypeParameter(Box::new(TypeWithTypeParameter {
        r#type: Type::ScopeInGlobal(identifier::from_string("ReadonlyMap")),
        type_parameter_list: vec![key_type, value_type],
    }))
}

/**
 * `Set<elementType>`
 */
pub fn set_type(element_type: Type) -> Type {
    Type::WithTypeParameter(Box::new(TypeWithTypeParameter {
        r#type: Type::ScopeInGlobal(identifier::from_string("Set")),
        type_parameter_list: vec![element_type],
    }))
}

/**
 * `ReadonlySet<elementType>`
 */
pub fn readonly_set_type(element_type: Type) -> Type {
    Type::WithTypeParameter(Box::new(TypeWithTypeParameter {
        r#type: Type::ScopeInGlobal(identifier::from_string("ReadonlySet")),
        type_parameter_list: vec![element_type],
    }))
}
