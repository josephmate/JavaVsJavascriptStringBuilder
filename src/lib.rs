mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct RustStringBuilder {
    // String push_str uses a vector internally
    // vector amortizes push to O(1) over many appends
    internal: String,
}


#[wasm_bindgen]
impl RustStringBuilder {

    #[wasm_bindgen(constructor)]
    pub fn new() -> RustStringBuilder {
        RustStringBuilder { internal: String::from("") }
    }

    pub fn append(&mut self, to_append: String) {
        self.internal.push_str(to_append.as_str())
    }

    pub fn build(&self) -> String  {
        String::from(self.internal.as_str())
    }
}