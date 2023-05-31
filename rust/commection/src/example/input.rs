const SAMPLE_SCHEMA: once_cell::sync::Lazy<crate::Schema> =
    once_cell::sync::Lazy::new(|| crate::Schema {
        name: String::from("example"),
        type_definitions: vec![crate::TypeDefinition {
            id: String::from("uuid?"),
            name: String::from("CustomType"),
            description: String::from("説明文"),
            attribute: None,
            body: crate::TypeBody::Product(crate::TypeProduct {
                fields: vec![crate::Field {
                    id: String::from("uuid?"),
                    name: String::from("name"),
                    description: String::from("名前"),
                    type_: todo!(),
                }],
            }),
        }],
    });
