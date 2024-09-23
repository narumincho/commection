import 'package:commection/commection/commectionResponse.dart';
import 'package:commection/simpleHttpType/response.dart';

SimpleResponse commectionResponseToSimpleResponse(CommectionResponse response) {
  return switch (response) {
    CommectionResponseEditorHtml(:final html) =>
      SimpleResponseOk(SimpleResponseBodyHtml(html)),
    CommectionResponseEditorIcon() =>
      SimpleResponseOk(SimpleResponseBodyPng(png)),
    CommectionResponseEditorScript() =>
      SimpleResponseOk(SimpleResponseBodyJs(js)),
  };
}
