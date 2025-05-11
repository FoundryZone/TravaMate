// Represents key-value pair attributes used in both request and response payloads
export type StringAttributes = {
  [key: string]: string;
};

// Represents the structure of content types and the associated body for both request and response
export type ContentBody = {
  [contentType: string]: {
    body: string; // For response body in JSON format or properties in request body
  };
};

// Represents the structure of parameters for both request and response
export type Parameter = {
  name: string;
  type: string;
  value: string;
};

// Represents the structure of properties in the request body content
export type Property = {
  name: string;
  type: string;
  value: string;
};

// For vector search configuration in the knowledge base section
export type VectorSearchConfiguration = {
  numberOfResults: number;
  overrideSearchType: "HYBRID" | "SEMANTIC";
  filter: RetrievalFilter;
};

// Represents retrieval filter structure, you can define this further based on your needs
export type RetrievalFilter = {
  [key: string]: any;
};

// Response Payload
export type BedrockAgentInvocationResponse = {
  messageVersion: "1.0";
  response: {
    actionGroup: string;
    apiPath: string;
    httpMethod: string;
    httpStatusCode: number;
    responseBody: ContentBody;
  };
  sessionAttributes?: StringAttributes;
  promptSessionAttributes?: StringAttributes;
  knowledgeBasesConfiguration?: KnowledgeBaseConfiguration[];
};

// Request Payload
export type BedrockAgentInvocationInput = {
  messageVersion: "1.0";
  agent: {
    name: string;
    id: string;
    alias: string;
    version: string;
  };
  inputText: string;
  sessionId: string;
  actionGroup: string;
  apiPath: string;
  httpMethod: string;
  parameters: Parameter[];
  requestBody: {
    content: {
      [contentType: string]: {
        properties: Property[];
      };
    };
  };
  sessionAttributes: StringAttributes;
  promptSessionAttributes: StringAttributes;
};

// Knowledge Base Configuration
export type KnowledgeBaseConfiguration = {
  knowledgeBaseId: string;
  retrievalConfiguration: {
    vectorSearchConfiguration: VectorSearchConfiguration;
  };
};
