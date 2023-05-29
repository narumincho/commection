class Lazy<T> {
  Lazy({required this.getFunction}) : _value = null;

  final T Function() getFunction;
  T? _value;

  T get value {
    final value = _value;
    if (value == null) {
      final v = getFunction();
      _value = v;
      return v;
    }
    return value;
  }
}
