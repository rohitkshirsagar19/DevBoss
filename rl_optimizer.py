# rl_optimizer.py

import torch
import torch.nn as nn
import torch.optim as optim

# --- A Simple Policy Network ---
# This network will learn to make better decisions. For this prototype, it's very basic.
class PolicyNetwork(nn.Module):
    def __init__(self):
        super(PolicyNetwork, self).__init__()
        # In a real system, inputs would be state features (e.g., task complexity, team load)
        # and outputs would be action probabilities. We'll simplify for now.
        self.fc1 = nn.Linear(4, 128) # Simplified state size of 4
        self.fc2 = nn.Linear(128, 2)   # Simplified action size of 2
        self.softmax = nn.Softmax(dim=-1)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return self.softmax(x)

# --- The RL Optimizer Class ---
class RLOptimizer:
    def __init__(self):
        self.policy_network = PolicyNetwork()
        self.optimizer = optim.Adam(self.policy_network.parameters(), lr=0.01)
        self.saved_log_probs = []
        self.rewards = []

    def select_action(self, state):
        # In a real implementation, 'state' would come from the project context.
        # Here we use a dummy state tensor.
        state_tensor = torch.tensor(state, dtype=torch.float32)
        probs = self.policy_network(state_tensor)
        
        # We sample an action based on the probabilities from the network
        action_dist = torch.distributions.Categorical(probs)
        action = action_dist.sample()
        
        # Save the log probability of the action taken, needed for training
        self.saved_log_probs.append(action_dist.log_prob(action))
        return action.item()

    def update_policy(self):
        # This is the core of the REINFORCE algorithm
        if not self.saved_log_probs:
            return

        policy_loss = []
        for log_prob, reward in zip(self.saved_log_probs, self.rewards):
            # First, calculate the loss
            loss = -log_prob * reward
            # Then, unsqueeze it and append it to the list
            policy_loss.append(loss.unsqueeze(0)) # <-- CORRECTED LOGIC

        self.optimizer.zero_grad()
        policy_loss_sum = torch.cat(policy_loss).sum()
        policy_loss_sum.backward()
        self.optimizer.step()
        
        # Clear the memory for the next episode
        self.saved_log_probs = []
        self.rewards = []
        print("--- RL Policy Updated ---")

# --- Reward Calculation ---
def calculate_reward(crew_result):
    # For now, we'll simulate an outcome since we don't have real execution data.
    # In a real system, you'd parse the 'crew_result' for metrics.
    
    # Mocked metrics
    duration_penalty = 5 # (e.g., 5 hours over deadline)
    quality_score = 95   # (e.g., 95/100)
    
    reward = quality_score - duration_penalty
    print(f"--- Reward Calculated: {reward} ---")
    return reward