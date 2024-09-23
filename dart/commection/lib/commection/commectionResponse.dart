import 'package:commection/html/data.dart';
import 'package:meta/meta.dart';

@immutable
sealed class CommectionResponse {
  const CommectionResponse();
}

@immutable
final class CommectionResponseEditorHtml implements CommectionResponse {
  const CommectionResponseEditorHtml(this.html);
  final StructuredHtml html;
}

@immutable
final class CommectionResponseEditorIcon implements CommectionResponse {
  const CommectionResponseEditorIcon();
}

@immutable
final class CommectionResponseEditorScript implements CommectionResponse {
  const CommectionResponseEditorScript();
}
