import {
  body,
  json,
  operation,
  query,
  response,
} from "@narumincho/http-server";

export const operations = [
  operation.get({
    queryParameters: {
      ids: query.array({
        deprecated: false,
        description: "",
        example: [],
        queryItemType: query.string(),
      }),
    },
    path: "",
    responses: [
      response.ok({
        headers: [],
        description: "",
        content: [body.applicationJson(json.object({}))],
      }),
    ],
    handler: ({ queryParameters, response }) =>
      response["200"]({}, "application/json", { e: queryParameters.ids }),
  }),
];
