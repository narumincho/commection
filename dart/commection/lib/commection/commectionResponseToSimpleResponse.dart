import 'package:commection/simpleHttpType/response.dart';

SimpleResponse commectionResponseToSimpleResponse(CommectionResponse response) {
  if (response is CommectionResponseOk) {
    return SimpleResponseOk(
      commectionResponseBodyToSimpleResponseBody(response.body),
    );
  } else if (response is CommectionResponseNotFoundError) {
    return SimpleResponseNotFoundError();
  } else {
    throw Exception('Unknown response type: $response');
  }
}
