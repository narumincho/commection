mod example;
mod jsTs;
mod simpleHttpType;

pub struct Schema {
    pub name: String,
    pub type_definitions: Vec<TypeDefinition>,
}

pub struct TypeDefinition {
    pub id: String,
    pub name: String,
    pub description: String,
    pub attribute: Option<TypeAttribute>,
    pub body: TypeBody,
}

pub enum TypeAttribute {
    AsBoolean,
}

pub enum TypeBody {
    Product(TypeProduct),
    Sum(TypeSum),
}

pub struct TypeProduct {
    pub fields: Vec<Field>,
}

pub struct Field {
    pub id: String,
    pub name: String,
    pub description: String,
    pub type_: Type,
}

pub struct TypeSum {
    pub patterns: Vec<Pattern>,
}

pub struct Pattern {
    pub type_: Type,
    pub parameter: Vec<String>,
    pub arguments: Vec<Type>,
}

pub struct Type {
    pub id: String,
    pub arguments: Vec<Type>,
}
