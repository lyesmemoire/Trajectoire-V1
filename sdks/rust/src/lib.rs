/**
 * Blueprint SDK for Rust
 */

pub struct Blueprint {
    version: String,
}

impl Blueprint {
    pub fn new() -> Self {
        Blueprint {
            version: String::from("1.0.0"),
        }
    }
    
    pub fn hello(&self) -> String {
        String::from("Hello from Blueprint SDK!")
    }
    
    pub fn version(&self) -> &str {
        &self.version
    }
}

impl Default for Blueprint {
    fn default() -> Self {
        Self::new()
    }
}
