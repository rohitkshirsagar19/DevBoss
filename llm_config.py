# llm_config.py

from langchain_openai import ChatOpenAI

# Initialize and configure the OpenAI LLM
# We recommend gpt-4o for its strong reasoning and tool-use capabilities
llm = ChatOpenAI(model="gpt-4o")