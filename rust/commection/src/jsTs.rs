mod data;
mod identifier;
mod to_string;
mod util;

#[cfg(test)]
mod tests {

    use super::data;
    use super::identifier;
    use super::to_string;
    use super::util;

    #[test]
    fn code() {
        let sample = data::Code {
            export_definition_list: vec![data::ExportDefinition::Function(data::Function {
                name: identifier::from_string("sampleServerFunction"),
                document: String::from("ミドルウェア"),
                type_parameter_list: vec![],
                parameter_list: vec![
                    data::ParameterWithDocument {
                        name: identifier::from_string("request"),
                        document: String::from("リクエスト"),
                        r#type: data::Type::ImportedType(data::ImportedType {
                            module_name: String::from("express"),
                            name: identifier::from_string("Request"),
                        }),
                    },
                    data::ParameterWithDocument {
                        name: identifier::from_string("response"),
                        document: String::from("レスポンス"),
                        r#type: data::Type::ImportedType(data::ImportedType {
                            module_name: String::from("express"),
                            name: identifier::from_string("Response"),
                        }),
                    },
                ],
                return_type: data::Type::Void,
                statement_list: vec![
                    data::Statement::VariableDefinition(data::VariableDefinitionStatement {
                        name: identifier::from_string("accept"),
                        r#type: data::Type::Union(Box::new(vec![
                            data::Type::String,
                            data::Type::Undefined,
                        ])),
                        is_const: true,
                        expr: util::get(
                            util::get(
                                data::Expr::Variable(identifier::from_string("request")),
                                "headers",
                            ),
                            "accept",
                        ),
                    }),
                    data::Statement::If(data::IfStatement {
                        condition: (util::logical_and(
                            util::not_equal(
                                data::Expr::Variable(identifier::from_string("accept")),
                                data::Expr::UndefinedLiteral,
                            ),
                            util::call_method(
                                data::Expr::Variable(identifier::from_string("accept")),
                                "includes",
                                vec![data::Expr::StringLiteral(String::from("text/html"))],
                            ),
                        )),
                        then_statement_list: vec![data::Statement::EvaluateExpr(
                            util::call_method(
                                data::Expr::Variable(identifier::from_string("response")),
                                "setHeader",
                                vec![
                                    data::Expr::StringLiteral(String::from("content-type")),
                                    data::Expr::StringLiteral(String::from("text/html")),
                                ],
                            ),
                        )],
                    }),
                ],
            })],
            statement_list: vec![],
        };
        println!(
            "{}",
            to_string::to_string(&sample, &data::CodeType::TypeScript)
        );
    }

    #[test]
    fn test_empty() {
        let sample_code = data::Code {
            export_definition_list: vec![],
            statement_list: vec![],
        };
        let code_as_string = to_string::to_string(&sample_code, &data::CodeType::JavaScript);
        assert_eq!(
            code_as_string,
            r###"/* eslint-disable */
/* generated by js-ts-code-generator. Do not edit! */

"###
        );
    }

    pub fn sample_code() -> data::Code {
        data::Code {
            export_definition_list: vec![
                data::ExportDefinition::Function(data::Function {
                    name: identifier::from_string("middleware"),
                    document: String::from("ミドルウェア"),
                    type_parameter_list: vec![],
                    parameter_list: vec![
                        data::ParameterWithDocument {
                            name: identifier::from_string("request"),
                            document: String::from("リクエスト"),
                            r#type: data::Type::ImportedType(data::ImportedType {
                                module_name: String::from("express"),
                                name: identifier::from_string("Request"),
                            }),
                        },
                        data::ParameterWithDocument {
                            name: identifier::from_string("response"),
                            document: String::from("レスポンス"),
                            r#type: data::Type::ImportedType(data::ImportedType {
                                module_name: String::from("express"),
                                name: identifier::from_string("Response"),
                            }),
                        },
                    ],
                    return_type: data::Type::Void,
                    statement_list: vec![
                        data::Statement::VariableDefinition(data::VariableDefinitionStatement {
                            name: identifier::from_string("accept"),
                            r#type: data::Type::Union(Box::new(vec![
                                data::Type::String,
                                data::Type::Undefined,
                            ])),
                            is_const: true,
                            expr: util::get(
                                util::get(
                                    data::Expr::Variable(identifier::from_string("request")),
                                    "headers",
                                ),
                                "accept",
                            ),
                        }),
                        data::Statement::If(data::IfStatement {
                            condition: (util::logical_and(
                                util::not_equal(
                                    data::Expr::Variable(identifier::from_string("accept")),
                                    data::Expr::UndefinedLiteral,
                                ),
                                util::call_method(
                                    data::Expr::Variable(identifier::from_string("accept")),
                                    "includes",
                                    vec![data::Expr::StringLiteral(String::from("text/html"))],
                                ),
                            )),
                            then_statement_list: vec![data::Statement::EvaluateExpr(
                                util::call_method(
                                    data::Expr::Variable(identifier::from_string("response")),
                                    "setHeader",
                                    vec![
                                        data::Expr::StringLiteral(String::from("content-type")),
                                        data::Expr::StringLiteral(String::from("text/html")),
                                    ],
                                ),
                            )],
                        }),
                    ],
                }),
                data::ExportDefinition::Function(data::Function {
                    name: identifier::from_string("getZeroIndexElement"),
                    document: String::from("Uint8Arrayの0番目の要素を取得する"),
                    type_parameter_list: vec![],
                    parameter_list: vec![data::ParameterWithDocument {
                        name: identifier::from_string("array"),
                        document: String::from("Uint8Array"),
                        r#type: util::uint8array_type(),
                    }],
                    return_type: data::Type::Number,
                    statement_list: vec![data::Statement::Return(data::Expr::Get(Box::new(
                        data::GetExpr {
                            expr: data::Expr::Variable(identifier::from_string("array")),
                            property_expr: data::Expr::NumberLiteral(0),
                        },
                    )))],
                }),
            ],
            statement_list: vec![
                data::Statement::VariableDefinition(data::VariableDefinitionStatement {
                    name: identifier::from_string("sorena"),
                    is_const: false,
                    r#type: data::Type::String,
                    expr: data::Expr::StringLiteral(String::from("それな")),
                }),
                util::console_log(data::Expr::Variable(identifier::from_string("sorena"))),
            ],
        }
    }

    #[test]
    fn test_snapshot() {
        let sample_code = sample_code();
        let code_as_typescript = to_string::to_string(&sample_code, &data::CodeType::TypeScript);
        let code_as_javascript = to_string::to_string(&sample_code, &data::CodeType::JavaScript);
        println!("TS\n{}", code_as_typescript);
        println!("JS\n{}", code_as_javascript);
        assert_eq!(
            code_as_typescript,
            r###"/* eslint-disable */
/* generated by js-ts-code-generator. Do not edit! */


/**
 * ミドルウェア
 * @param request リクエスト
 * @param response レスポンス
 */
export const middleware = (request: $$$express.Request, response: $$$express.Response): void => {
  const accept: string | undefined = request.headers.accept;
  if (accept !== undefined && accept.includes("text/html")) {
    response.setHeader("content-type", "text/html");
  }
};



/**
 * Uint8Arrayの0番目の要素を取得する
 * @param array Uint8Array
 */
export const getZeroIndexElement = (array: Uint8Array): number => (array[0]);

{
  let sorena: string = "それな";
  console.log(sorena);
}"###
        );
        assert_eq!(
            code_as_javascript,
            r###"/* eslint-disable */
/* generated by js-ts-code-generator. Do not edit! */


/**
 * ミドルウェア
 * @param request リクエスト
 * @param response レスポンス
 */
export const middleware = (request, response) => {
  const accept = request.headers.accept;
  if (accept !== undefined && accept.includes("text/html")) {
    response.setHeader("content-type", "text/html");
  }
};



/**
 * Uint8Arrayの0番目の要素を取得する
 * @param array Uint8Array
 */
export const getZeroIndexElement = (array) => (array[0]);

{
  let sorena = "それな";
  console.log(sorena);
}"###
        );
        assert!(code_as_typescript.contains("void"));
        assert!(!code_as_javascript.contains("void"));
    }
}
