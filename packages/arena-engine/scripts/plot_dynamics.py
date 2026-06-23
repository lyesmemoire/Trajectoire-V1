import os
import glob
import json
import matplotlib.pyplot as plt
import numpy as np

def load_data(filepath):
    data = []
    with open(filepath, 'r') as f:
        for line in f:
            if line.strip():
                data.append(json.loads(line))
    return data

def plot_scores(data, title, out_path):
    gens = [d['generation'] for d in data]
    p_best = [d['policyBestScore'] for d in data]
    p_avg = [d['policyAvgScore'] for d in data]
    c_best = [d['chaosBestScore'] for d in data]
    c_avg = [d['chaosAvgScore'] for d in data]
    c_cost = [d['chaosAvgCost'] for d in data]

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), sharex=True)

    ax1.plot(gens, p_best, label='Policy Best Score', color='blue')
    ax1.plot(gens, p_avg, label='Policy Avg Score', color='lightblue', linestyle='--')
    ax1.plot(gens, c_best, label='Chaos Best Impact', color='red')
    ax1.plot(gens, c_avg, label='Chaos Avg Impact', color='salmon', linestyle='--')
    ax1.set_ylabel('Fitness / Score')
    ax1.set_title(f'{title} - Scores over Generations')
    ax1.legend()
    ax1.grid(True, alpha=0.3)

    ax2.plot(gens, c_cost, label='Chaos Avg Cost', color='purple', linewidth=2)
    ax2.set_ylabel('Chaos Cost')
    ax2.set_xlabel('Generation')
    ax2.legend()
    ax2.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig(out_path)
    plt.close()

def plot_phase_space(data, title, out_path):
    # Plotting how parameters evolve
    # Example: dropRate vs reorderRate for chaos, lamportPenalty vs burstDetection for policy
    gens = [d['generation'] for d in data]
    
    # Chaos centroid trajectory
    drop_rate = [d['chaosCentroid']['dropRate'] for d in data]
    reorder_rate = [d['chaosCentroid']['reorderRate'] for d in data]
    
    plt.figure(figsize=(8, 6))
    
    # Plot the trajectory as a path
    plt.plot(drop_rate, reorder_rate, '-o', alpha=0.5, color='gray')
    
    # Scatter plot with color mapping to generation
    sc = plt.scatter(drop_rate, reorder_rate, c=gens, cmap='viridis', s=100)
    plt.colorbar(sc, label='Generation')
    
    # Annotate start and end
    plt.annotate('Start', (drop_rate[0], reorder_rate[0]), textcoords="offset points", xytext=(0,10), ha='center')
    plt.annotate('End', (drop_rate[-1], reorder_rate[-1]), textcoords="offset points", xytext=(0,10), ha='center', weight='bold')

    plt.xlabel('Chaos Centroid: Drop Rate')
    plt.ylabel('Chaos Centroid: Reorder Rate')
    plt.title(f'{title} - Chaos Phase Space Trajectory')
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(out_path)
    plt.close()

def plot_autocorrelation(data, title, out_path):
    p_avg = np.array([d['policyAvgScore'] for d in data])
    
    # Subtract mean to get autocovariance
    p_avg_centered = p_avg - np.mean(p_avg)
    
    n = len(p_avg)
    autocorr = np.correlate(p_avg_centered, p_avg_centered, mode='full')
    # Take the second half and normalize
    autocorr = autocorr[n-1:] / autocorr[n-1]
    
    lags = np.arange(n)
    
    plt.figure(figsize=(8, 4))
    plt.vlines(lags[:30], [0], autocorr[:30], color='blue') # Max 30 lags
    plt.axhline(0, color='black', linewidth=1)
    
    # 95% confidence bounds (approximate)
    plt.axhline(1.96 / np.sqrt(n), color='red', linestyle='--', alpha=0.5)
    plt.axhline(-1.96 / np.sqrt(n), color='red', linestyle='--', alpha=0.5)
    
    plt.xlabel('Lag (Generations)')
    plt.ylabel('Autocorrelation')
    plt.title(f'{title} - Autocorrelation of Policy Avg Score')
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(out_path)
    plt.close()

def main():
    base_dir = os.path.join(os.getcwd(), 'artifacts', 'analytics')
    if not os.path.exists(base_dir):
        print(f"Directory {base_dir} not found. Run tests first.")
        return

    jsonl_files = glob.glob(os.path.join(base_dir, '*.jsonl'))
    if not jsonl_files:
        print("No JSONL files found in artifacts/analytics.")
        return

    # Process all files
    for filepath in jsonl_files:
        filename = os.path.basename(filepath)
        experiment_name = filename.split('_')[0]
        timestamp = filename.split('_')[1].split('.')[0]
        
        data = load_data(filepath)
        print(f"Processing {filename} ({len(data)} generations)")
        
        plot_scores(data, f"Experiment: {experiment_name}", os.path.join(base_dir, f"{experiment_name}_{timestamp}_scores.png"))
        plot_phase_space(data, f"Experiment: {experiment_name}", os.path.join(base_dir, f"{experiment_name}_{timestamp}_phase.png"))
        
        if len(data) > 20: # Only plot autocorrelation for long runs
            plot_autocorrelation(data, f"Experiment: {experiment_name}", os.path.join(base_dir, f"{experiment_name}_{timestamp}_autocorr.png"))

if __name__ == "__main__":
    main()
