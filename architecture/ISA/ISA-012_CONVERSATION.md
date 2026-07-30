# ISA-012: Conversation Instructions

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define conversation instructions for conversation operations

---

## CONVERSE_START
**Opcode**: 0x9A  
**Category**: Conversation  
**Description**: Start conversation

**Encoding**:
```
[opcode: 1 byte]
[context: 4 bytes]
[model: 4 bytes]
```

**Operands**:
- context: Conversation context identifier
- model: Conversation model identifier

**Side Effects**: Starts conversation, creates conversation state

**Latency**: 30 cycles

**Token Cost**: 100 tokens

**Memory Cost**: 192 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
CONVERSE_START context_id, model_id
```

---

## CONVERSE_MESSAGE
**Opcode**: 0x9B  
**Category**: Conversation  
**Description**: Send message in conversation

**Encoding**:
```
[opcode: 1 byte]
[message: 4 bytes]
[conversation: 4 bytes]
```

**Operands**:
- message: Message identifier
- conversation: Conversation identifier

**Side Effects**: Sends message, updates conversation state

**Latency**: 50 cycles

**Token Cost**: 200 tokens

**Memory Cost**: 256 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
CONVERSE_MESSAGE message_id, conv_id
```

---

## CONVERSE_RECEIVE
**Opcode**: 0x9C  
**Category**: Conversation  
**Description**: Receive message from conversation

**Encoding**:
```
[opcode: 1 byte]
[conversation: 4 bytes]
```

**Operands**:
- conversation: Conversation identifier

**Side Effects**: Receives message, updates conversation state

**Latency**: 45 cycles

**Token Cost**: 180 tokens

**Memory Cost**: 224 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
CONVERSE_RECEIVE conv_id
```

---

## CONVERSE_END
**Opcode**: 0x9D  
**Category**: Conversation  
**Description**: End conversation

**Encoding**;
```
[opcode: 1 byte]
[conversation: 4 bytes]
```

**Operands**:
- conversation: Conversation identifier

**Side Effects**: Ends conversation, saves conversation state

**Latency**: 20 cycles

**Token Cost**: 50 tokens

**Memory Cost**: 128 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
CONVERSE_END conv_id
```

---

## CONVERSE_CONTEXT
**Opcode**: 0x9E  
**Category**: Conversation  
**Description**: Update conversation context

**Encoding**:
```
[opcode: 1 byte]
[context: 4 bytes]
[conversation: 4 bytes]
```

**Operands**:
- context: New context identifier
- conversation: Conversation identifier

**Side Effects**: Updates context, modifies conversation state

**Latency**: 15 cycles

**Token Cost**: 75 tokens

**Memory Cost**: 160 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
CONVERSE_CONTEXT context_id, conv_id
```

---

## CONVERSE_SUMMARIZE
**Opcode**: 0x9F  
**Category**: Conversation  
**Description**: Summarize conversation

**Encoding**:
```
[opcode: 1 byte]
[conversation: 4 bytes]
[summarizer: 4 bytes]
```

**Operands**:
- conversation: Conversation identifier
- summarizer: Summarization function (constant pool index)

**Side Effects**: Summarizes conversation, creates summary

**Latency**: 40 cycles

**Token Cost**: 150 tokens

**Memory Cost**: 288 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
CONVERSE_SUMMARIZE conv_id, summarizer_id
```
