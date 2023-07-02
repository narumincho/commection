use non_empty_string::NonEmptyString;

#[derive(Debug)]
pub struct Code {
    /// インポートするファイル名
    /// - `package:meta/meta.dart`
    /// - `package:fast_immutable_collections/fast_immutable_collections.dart`
    ///
    /// は自動的に入る
    pub import_package_and_file_names: Vec<ImportPackageAndFileName>,
    pub declaration_list: Vec<Declaration>,
}

#[derive(Debug)]
pub struct ImportPackageAndFileName {
    pub package_and_file_name: NonEmptyString,
    pub as_name: Option<NonEmptyString>,
}

#[derive(Debug)]
pub enum Declaration {
    Class(ClassDeclaration),
    Enum(EnumDeclaration),
}

#[derive(Debug)]
pub struct ClassDeclaration {
    pub name: NonEmptyString,
    pub documentation_comments: String,
    pub fields: Vec<Field>,
    pub modifier: Option<ClassModifier>,
}

#[derive(Debug)]
pub struct Field {}

#[derive(Debug)]
pub enum ClassModifier {
    Abstract,
    Sealed,
    Final,
}

#[derive(Debug)]
pub struct EnumDeclaration {}

#[derive(Debug)]
pub enum Expr {
    IntLiteral(i64),
    StringLiteral(String),
    EnumValue(EnumValue),
    MethodCall(Box<MethodCall>),
    Constructor(Constructor),
    Lambda(Lambda),
    ListLiteral(ListLiteral),
    MapLiteral(MapLiteral),
    Variable(Variable),
    Get(Box<Get>),
    Is(Box<Is>),
    Operator(Box<ExprOperator>),
    Null,
    Bool(bool),
    ConditionalOperator(Box<ConditionalOperator>),
}

#[derive(Debug)]
pub struct EnumValue {
    pub type_name: String,
    pub value: String,
}

#[derive(Debug)]
pub struct MethodCall {
    pub variable: Expr,
    pub method_name: String,
    pub positional_arguments: Vec<Expr>,
    pub named_arguments: Vec<NameAndExpr>,
    pub optional_chaining: bool,
}

#[derive(Debug)]
pub struct Constructor {
    pub class_name: String,
    pub positional_arguments: Vec<Expr>,
    pub named_arguments: Vec<NameAndExpr>,
    pub is_const: bool,
}

#[derive(Debug)]
pub struct NameAndExpr {
    pub name: String,
    pub expr: Expr,
}

#[derive(Debug)]
pub struct Lambda {
    pub parameter_names: Vec<String>,
    pub statements: Vec<Statement>,
}

#[derive(Debug)]
pub struct ListLiteral {
    pub items: Vec<Expr>,
}

#[derive(Debug)]
pub struct MapLiteral {
    pub items: Vec<MapLiteralItem>,
}

#[derive(Debug)]
pub struct MapLiteralItem {
    pub key: Expr,
    pub value: Expr,
}

#[derive(Debug)]
pub struct Variable {
    pub name: String,
    pub is_const: bool,
}

#[derive(Debug)]
pub struct Get {
    pub expr: Expr,
    pub field_name: String,
}

#[derive(Debug)]
pub struct Is {
    pub expr: Expr,
    pub type_: Type,
}

#[derive(Debug)]
pub struct ExprOperator {
    pub left: Expr,
    pub operator: Operator,
    pub right: Expr,
}

#[derive(Debug)]
pub struct ConditionalOperator {
    condition: Expr,
    then_expr: Expr,
    else_expr: Expr,
}

#[derive(Debug)]
pub struct Call {
    pub function_name: String,
    pub positional_arguments: Vec<Expr>,
    pub named_arguments: Vec<NameAndExpr>,
    pub is_await: bool,
}

#[derive(Debug)]
pub enum Type {
    Function(Box<FunctionType>),
    Normal(NormalType),
}

#[derive(Debug)]
pub struct FunctionType {
    pub return_type: Type,
    pub parameters: Vec<NameAndType>,
    pub is_nullable: bool,
}

#[derive(Debug)]
pub struct NameAndType {
    pub name: String,
    pub type_: Type,
}

#[derive(Debug)]
pub struct NormalType {
    pub name: String,
    pub arguments: Vec<Type>,
    pub is_nullable: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Operator {
    NullishCoalescing,
    NotEqual,
    Equal,
    Add,
    LogicalAnd,
}

#[derive(Debug)]
pub enum Statement {
    Return(Expr),
    Final(FinalStatement),
    If(IfStatement),
    Switch(Switch),
    Throw(Expr),
}

#[derive(Debug)]
pub struct FinalStatement {
    pub variable_name: String,
    pub expr: Expr,
}

#[derive(Debug)]
pub struct IfStatement {
    pub condition: Expr,
    pub then_statements: Vec<Statement>,
    pub else_statements: Vec<Statement>,
}

#[derive(Debug)]
pub struct Switch {
    pub expr: Expr,
    pub cases: Vec<SwitchCase>,
}

#[derive(Debug)]
pub struct SwitchCase {
    pub expr: Expr,
    pub statements: Vec<Statement>,
}
