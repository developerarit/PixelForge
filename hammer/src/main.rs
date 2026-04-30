use image::imageops::FilterType;
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 5 {
        eprintln!("Usage: cargo run <input> <output> <width> <height>");
        return;
    }

    let input_path = &args[1];
    let output_path = &args[2];
    let width: u32 = args[3].parse().expect("Invalid width");
    let height: u32 = args[4].parse().expect("Invalid height");

    let img = image::open(input_path).expect("Failed to open image");

    let resized = img.resize(width, height, FilterType::Lanczos3);

    resized.save(output_path).expect("Failed to save image");

    println!("Image resized successfully → {}", output_path);
}
