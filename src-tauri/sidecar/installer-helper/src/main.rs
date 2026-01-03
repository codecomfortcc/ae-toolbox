mod jobs;
mod db;
mod installer;
use crossbeam_channel::unbounded;
use jobs::{JobRequest, JobResponse};
use std::io::{self, BufRead};
fn main() {
    let (tx, rx) = unbounded::<JobRequest>();
    eprintln!("[SIDECAR] Engine Started. Waiting for jobs..."); // PRINT

    for i in 0..4 {
        let rx = rx.clone();
        std::thread::spawn(move || {
            for job in rx.iter() {
                let id = job.id;
                eprintln!("[SIDECAR] Thread {} received job: {:?} (ID: {})", i, job.kind, id); // PRINT
                
                let result = installer::dispatch(job);

                let response = match result {
                    Ok(data) => {
                        eprintln!("[SIDECAR] Job {} succeeded", id); // PRINT
                        JobResponse { id, success: true, error: None, data }
                    },
                    Err(e) => {
                        eprintln!("[SIDECAR] Job {} FAILED: {:?}", id, e.message); // PRINT
                        JobResponse { id, success: false, error: Some(e), data: None }
                    },
                };

                println!("{}", serde_json::to_string(&response).unwrap());
            }
        });
    }

    for line in io::stdin().lock().lines().flatten() {
        // Log raw input to see if JSON is malformed
        eprintln!("[SIDECAR] Raw Input: {}", line); 
        if let Ok(job) = serde_json::from_str::<JobRequest>(&line) {
            tx.send(job).ok();
        } else {
            eprintln!("[SIDECAR] Failed to parse JSON request!");
        }
    }
}
