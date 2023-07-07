pub fn divide_list<T, F>(vec: Vec<T>, compare: F) -> (Vec<T>, Vec<T>)
where
    F: Fn(&T) -> bool,
{
    let mut true_vec = Vec::new();
    let mut false_vec = Vec::new();

    for item in vec {
        if compare(&item) {
            true_vec.push(item);
        } else {
            false_vec.push(item);
        }
    }

    (true_vec, false_vec)
}
