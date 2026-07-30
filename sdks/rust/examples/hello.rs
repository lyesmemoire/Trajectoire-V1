use blueprint_sdk::Blueprint;

fn main() {
    let bp = Blueprint::new();
    println!("{}", bp.hello());
    println!("SDK Version: {}", bp.version());
}
