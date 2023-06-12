/// コードの種類
#[derive(PartialEq, Eq, Debug)]
pub enum CodeType {
    /// JavaScript. ブラウザで動作するプログラミング言語
    JavaScript,

    /// TypeScript. JavaScript に 型をつけた言語
    TypeScript,
}

/// TypeScriptやJavaScriptのコードを表現する. TypeScriptでも出力できるように型情報をつける必要がある
#[derive(PartialEq, Eq, Debug)]
pub struct Code {
    /// 外部に公開する定義
    pub export_definition_list: Vec<ExportDefinition>,

    /// 定義した後に実行するコード
    pub statement_list: Vec<Statement>,
}

/// 外部に公開する定義
#[derive(PartialEq, Eq, Debug)]
pub enum ExportDefinition {
    /// 型定義. JavaScript では出力されない
    TypeAlias(TypeAlias),

    /// 関数
    Function(Function),

    /// 変数
    Variable(Variable),
}

/// 型に別名を付けて定義する.
/// ```ts
/// export type T = {}
/// ```
#[derive(PartialEq, Eq, Debug)]
pub struct TypeAlias {
    pub name: super::identifier::Identifier,
    pub type_parameter_list: Vec<super::identifier::Identifier>,
    pub document: String,
    pub r#type: Type,
}

#[derive(PartialEq, Eq, Debug)]
pub struct Function {
    /// 外部に公開する関数の名前
    pub name: super::identifier::Identifier,

    /// ドキュメント
    pub document: String,

    /// 型パラメーターのリスト
    pub type_parameter_list: Vec<super::identifier::Identifier>,

    /// パラメーター
    pub parameter_list: Vec<ParameterWithDocument>,

    /// 戻り値の型
    pub return_type: Type,

    /// 関数の本体
    pub statement_list: Vec<Statement>,
}
/// ドキュメント付きの関数のパラメーター. パラメーター名, ドキュメント, 型
#[derive(PartialEq, Eq, Debug)]
pub struct ParameterWithDocument {
    /// パラメーター名
    pub name: super::identifier::Identifier,

    /// ドキュメント
    pub document: String,

    /// パラメーターの型
    pub r#type: Type,
}

/// 関数のパラメーター. パラメーター名, ドキュメント
#[derive(PartialEq, Eq, Debug)]
pub struct Parameter {
    /// パラメーター名
    pub name: super::identifier::Identifier,

    /// パラメーターの型
    pub r#type: Type,
}

/// 変数
#[derive(PartialEq, Eq, Debug)]
pub struct Variable {
    /// 変数の名前
    pub name: super::identifier::Identifier,

    /// ドキュメント
    pub document: String,

    /// 変数の型
    pub r#type: Type,

    /// 変数の式
    pub expr: Expr,
}

/// 単項演算子
#[derive(PartialEq, Eq, Debug)]
pub enum UnaryOperator {
    Minus,
    BitwiseNot,
    LogicalNot,
}

/// 2項演算子
#[derive(PartialEq, Eq, Debug)]
pub enum BinaryOperator {
    Exponentiation,
    Multiplication,
    Division,
    Remainder,
    Addition,
    Subtraction,
    LeftShift,
    SignedRightShift,
    UnsignedRightShift,
    LessThan,
    LessThanOrEqual,
    Equal,
    NotEqual,
    BitwiseAnd,
    BitwiseXOr,
    BitwiseOr,
    LogicalAnd,
    LogicalOr,
}

/// 式
#[derive(PartialEq, Eq, Debug)]
pub enum Expr {
    NumberLiteral(i32),
    StringLiteral(String),
    BooleanLiteral(bool),
    NullLiteral,
    UndefinedLiteral,
    UnaryOperator(Box<UnaryOperatorExpr>),
    BinaryOperator(Box<BinaryOperatorExpr>),
    ConditionalOperator(Box<ConditionalOperatorExpr>),
    ArrayLiteral(Box<Vec<ArrayItem>>),
    ObjectLiteral(Box<Vec<Member>>),
    Lambda(Box<LambdaExpr>),
    Variable(super::identifier::Identifier),
    GlobalObjects(super::identifier::Identifier),
    ImportedVariable(ImportedVariable),
    Get(Box<GetExpr>),
    Call(Box<CallExpr>),
    New(Box<CallExpr>),
    TypeAssertion(Box<TypeAssertion>),
}

#[derive(PartialEq, Eq, Debug)]
pub enum Statement {
    EvaluateExpr(Expr),
    Set(SetStatement),
    If(IfStatement),
    ThrowError(Expr),
    Return(Expr),
    ReturnVoid,
    Continue,
    VariableDefinition(VariableDefinitionStatement),
    FunctionDefinition(FunctionDefinitionStatement),
    For(ForStatement),
    ForOf(ForOfStatement),
    WhileTrue(Vec<Statement>),
    Break,
    Switch(SwitchStatement),
}

/// 型
#[derive(PartialEq, Eq, Debug)]
pub enum Type {
    Number,
    String,
    Boolean,
    Undefined,
    Null,
    Never,
    Void,
    Object(Box<Vec<MemberType>>),
    Function(Box<FunctionType>),
    WithTypeParameter(Box<TypeWithTypeParameter>),
    Union(Box<Vec<Type>>),
    Intersection(Box<IntersectionType>),
    ImportedType(ImportedType),
    ScopeInFile(super::identifier::Identifier),
    ScopeInGlobal(super::identifier::Identifier),
    StringLiteral(String),
}
/// 単項演算子と適用される式
#[derive(PartialEq, Eq, Debug)]
pub struct UnaryOperatorExpr {
    /// 単項演算子
    pub operator: UnaryOperator,

    /// 適用される式
    pub expr: Expr,
}

/// 2項演算子と左右の式
#[derive(PartialEq, Eq, Debug)]
pub struct BinaryOperatorExpr {
    /// 2項演算子
    pub operator: BinaryOperator,

    /// 左の式
    pub left: Expr,

    /// 右の式
    pub right: Expr,
}
/// 条件演算子
#[derive(PartialEq, Eq, Debug)]
pub struct ConditionalOperatorExpr {
    /// 条件の式
    pub condition: Expr,

    /// 条件がtrueのときに評価される式
    pub then_expr: Expr,

    /// 条件がfalseのときに評価される式
    pub else_expr: Expr,
}
/// 配列リテラルの要素
#[derive(PartialEq, Eq, Debug)]
pub struct ArrayItem {
    /// 式
    pub expr: Expr,

    /// スプレッド ...a のようにするか
    pub spread: bool,
}
/// オブジェクトリテラルの要素
#[derive(PartialEq, Eq, Debug)]
pub enum Member {
    Spread(Expr),
    KeyValue(KeyValue),
}

/// 文字列のkeyと式のvalue
#[derive(PartialEq, Eq, Debug)]
pub struct KeyValue {
    /// key
    pub key: String,

    /// value
    pub value: Expr,
}

/// ラムダ式
#[derive(PartialEq, Eq, Debug)]
pub struct LambdaExpr {
    /// パラメーターのリスト
    pub parameter_list: Vec<Parameter>,

    /// 型パラメーターのリスト
    pub type_parameter_list: Vec<super::identifier::Identifier>,

    /// 戻り値の型
    pub return_type: Type,

    /// ラムダ式本体
    pub statement_list: Vec<Statement>,
}
/// インポートした変数
#[derive(PartialEq, Eq, Debug)]
pub struct ImportedVariable {
    /// モジュール名, 使うときにはnamedインポートされ, そのモジュール識別子は自動的につけられる
    pub module_name: String,

    /// 変数名
    pub name: super::identifier::Identifier,
}
/// プロパティアクセス
#[derive(PartialEq, Eq, Debug)]
pub struct GetExpr {
    /// 式
    pub expr: Expr,

    /// プロパティの式
    pub property_expr: Expr,
}

/// 式と呼ぶパラメーター
#[derive(PartialEq, Eq, Debug)]
pub struct CallExpr {
    /// 呼ばれる式
    pub expr: Expr,
    /// パラメーター
    pub parameter_list: Vec<Expr>,
}

/// 型アサーション
#[derive(PartialEq, Eq, Debug)]
pub struct TypeAssertion {
    /// 型アサーションを受ける式
    pub expr: Expr,

    /// 型
    pub r#type: Type,
}

/// 代入文
#[derive(PartialEq, Eq, Debug)]
pub struct SetStatement {
    /// 対象となる式. 指定の仕方によってはJSのSyntaxErrorになる
    pub target: Expr,

    /// 演算子を=の左につける
    pub operator_maybe: Option<BinaryOperator>,

    /// 式
    pub expr: Expr,
}

/// if文
#[derive(PartialEq, Eq, Debug)]
pub struct IfStatement {
    /// 条件の式
    pub condition: Expr,

    /// 条件がtrueのときに実行する文
    pub then_statement_list: Vec<Statement>,
}

/// ローカル変数定義
#[derive(PartialEq, Eq, Debug)]
pub struct VariableDefinitionStatement {
    /// 変数名
    pub name: super::identifier::Identifier,

    /// 変数の型
    pub r#type: Type,

    /// 式
    pub expr: Expr,

    /// constかどうか. falseはlet
    pub is_const: bool,
}

/// ローカル関数定義
#[derive(PartialEq, Eq, Debug)]
pub struct FunctionDefinitionStatement {
    /// 変数名
    pub name: super::identifier::Identifier,

    /// 型パラメーターのリスト
    pub type_parameter_list: Vec<super::identifier::Identifier>,

    /// パラメーターのリスト
    pub parameter_list: Vec<ParameterWithDocument>,

    /// 戻り値の型
    pub return_type: Type,

    /// 関数本体
    pub statement_list: Vec<Statement>,
}

/// for文
#[derive(PartialEq, Eq, Debug)]
pub struct ForStatement {
    /// カウンタ変数名
    pub counter_variable_name: super::identifier::Identifier,

    /// ループの上限の式
    pub until_expr: Expr,

    /// 繰り返す文
    pub statement_list: Vec<Statement>,
}

/// forOf文
#[derive(PartialEq, Eq, Debug)]
pub struct ForOfStatement {
    /// 要素の変数名
    pub element_variable_name: super::identifier::Identifier,

    /// 繰り返す対象
    pub iterable_expr: Expr,

    /// 繰り返す文
    pub statement_list: Vec<Statement>,
}

/// switch文
#[derive(PartialEq, Eq, Debug)]
pub struct SwitchStatement {
    /// switch(a) {} の a
    pub expr: Expr,

    /// case "text": { statementList }
    pub pattern_list: Vec<Pattern>,
}

/// switch文のcase "text": { statementList } の部分
#[derive(PartialEq, Eq, Debug)]
pub struct Pattern {
    /// case に使う文字列
    pub case_string: String,

    /// statementList
    pub statement_list: Vec<Statement>,
}

/// オブジェクトのメンバーの型
#[derive(PartialEq, Eq, Debug)]
pub struct MemberType {
    /// プロパティ名
    pub name: String,

    /// 必須かどうか falseの場合 ? がつく
    pub required: bool,

    /// 型
    pub r#type: Type,

    /// ドキュメント
    pub document: String,
}

/// 関数の型
#[derive(PartialEq, Eq, Debug)]
pub struct FunctionType {
    /// 型パラメーターのリスト
    pub type_parameter_list: Vec<super::identifier::Identifier>,

    /// パラメーターの型. 意味のない引数名は適当に付く
    pub parameter_list: Vec<Type>,

    /// 戻り値の型
    pub return_type: Type,
}

/// パラメーター付きの型
#[derive(PartialEq, Eq, Debug)]
pub struct TypeWithTypeParameter {
    /// パラメーターをつけられる型
    pub r#type: Type,

    /// パラメーターに指定する型. なにも要素を入れなけければ T<>ではなく T の形式で出力される
    pub type_parameter_list: Vec<Type>,
}

/// 交差型 `A & B`
#[derive(PartialEq, Eq, Debug)]
pub struct IntersectionType {
    /// 左に指定する型
    pub left: Type,

    /// 右に指定する型
    pub right: Type,
}

/// インポートされた型
#[derive(PartialEq, Eq, Debug)]
pub struct ImportedType {
    /// モジュール名 `fs` `three` `react` `typescript` `util` など
    pub module_name: String,

    /// 型の名前
    pub name: super::identifier::Identifier,
}
