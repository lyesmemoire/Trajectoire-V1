# ISA-024: Communication Instructions

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define communication instructions for communication operations

---

## COMM_SEND
**Opcode**: 0xEA  
**Category**: Communication  
**Description**: Send message to destination

**Encoding**:
```
[opcode: 1 byte]
[message: 4 bytes]
[destination: 4 bytes]
[protocol: 4 bytes]
```

**Operands**:
- message: Message identifier
- destination: Destination identifier
- protocol: Protocol identifier

**Side Effects**: Sends message, updates communication state

**Latency**: 50 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 256 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
COMM_SEND message_id, dest_id, protocol_id
```

---

## COMM_RECEIVE
**Opcode**: 0xEB  
**Category**: Communication  
**Description**: Receive message from source

**Encoding**:
```
[opcode: 1 byte]
[source: 4 bytes]
[protocol: 4 bytes]
```

**Operands**:
- source: Source identifier
- protocol: Protocol identifier

**Side Effects**: Receives message, updates communication state

**Latency**: 50 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 256 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
COMM_RECEIVE source_id, protocol_id
```

---

## COMM_BROADCAST
**Opcode**: 0xEC  
**Category**: Communication  
**Description**: Broadcast message to multiple destinations

**Encoding**:
```
[opcode: 1 byte]
[message: 4 bytes]
[destinations: 4 bytes]
[count: 4 bytes]
[protocol: 4 bytes]
```

**Operands**:
- message: Message identifier
- destinations: Destination identifiers array
- count: Number of destinations
- protocol: Protocol identifier

**Side Effects**: Broadcasts message, updates communication state

**Latency**: 100 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 256 * count bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
COMM_BROADCAST message_id, dest_array, 5, protocol_id
```

---

## COMM_REPLY
**Opcode**: 0xED  
**Category**: Communication  
**Description**: Reply to received message

**Encoding**:
```
[opcode: 1 byte]
[message: 4 bytes]
[original: 4 bytes]
```

**Operands**:
- message: Reply message identifier
- original: Original message identifier

**Side Effects**: Sends reply, updates communication state

**Latency**: 50 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 256 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
COMM_REPLY reply_id, original_id
```

---

## COMM_SUBSCRIBE
**Opcode**: 0xEE  
**Category**: Communication  
**Description**: Subscribe to channel

**Encoding**:
```
[opcode: 1 byte]
[channel: 4 bytes]
[handler: 4 bytes]
```

**Operands**:
- channel: Channel identifier
- handler: Handler function (constant pool index)

**Side Effects**: Subscribes to channel, updates subscription state

**Latency**: 20 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 128 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
COMM_SUBSCRIBE channel_id, handler_id
```

---

## COMM_UNSUBSCRIBE
**Opcode**: 0xEF  
**Category**: Communication  
**Description**: Unsubscribe from channel

**Encoding**:
```
[opcode: 1 byte]
[channel: 4 bytes]
```

**Operands**:
- channel: Channel identifier

**Side Effects**: Unsubscribes from channel, updates subscription state

**Latency**: 15 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 64 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
COMM_UNSUBSCRIBE channel_id
```
