/*
  Some sample events for mock execution

  Each event has:
    event_id: unique identifier for the event
    type: type of event (e.g., 'PatientSatisfaction', 'wRVU')
    valid_time: when the event is considered valid (ISO 8601 format)
    participant_id: identifier for the participant associated with the event
    value: numerical value associated with the event (if applicable)
    characterization: qualitative description of the event (if applicable)
    system_time: when the event was recorded in the system (ISO 8601 format)

  These events can be used to test and demonstrate the functionality of the WTE blocks,
  filtering on event type, participant, and time ranges.
*/

const SampleEvents = [
  {
    event_id: 1,
    type: 'PatientSatisfaction',
    valid_time: '2024-01-15T10:30:00Z',
    participant_id: 'doctor_001',
    value: 4.2,
    characterization: 'Excellent',
    system_time: '2024-01-15T10:35:00Z',
  },
  {
    event_id: 2,
    type: 'PatientSatisfaction',
    valid_time: '2024-01-16T14:20:00Z',
    participant_id: 'doctor_001',
    value: 3.8,
    characterization: 'Good',
    system_time: '2024-01-16T14:25:00Z',
  },
  {
    event_id: 3,
    type: 'PatientSatisfaction',
    valid_time: '2024-01-17T09:15:00Z',
    participant_id: 'doctor_001',
    value: 4.5,
    characterization: 'Excellent',
    system_time: '2024-01-17T09:20:00Z',
  },
  {
    event_id: 4,
    type: 'wRVU',
    valid_time: '2024-01-15T11:00:00Z',
    participant_id: 'doctor_001',
    value: 2.5,
    characterization: 'Standard',
    system_time: '2024-01-15T11:05:00Z',
  },
  {
    event_id: 5,
    type: 'wRVU',
    valid_time: '2024-01-16T15:30:00Z',
    participant_id: 'doctor_001',
    value: 3.2,
    characterization: 'Complex',
    system_time: '2024-01-16T15:35:00Z',
  },
  {
    event_id: 6,
    type: 'PatientSatisfaction',
    valid_time: '2024-01-18T13:45:00Z',
    participant_id: 'doctor_002',
    value: 3.1,
    characterization: 'Fair',
    system_time: '2024-01-18T13:50:00Z',
  },
];

const DistinctEventTypes = [...new Set(SampleEvents.map(e => e.type))];

export { DistinctEventTypes, SampleEvents };