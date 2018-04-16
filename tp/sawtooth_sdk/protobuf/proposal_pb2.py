# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: proposal.proto

import sys
_b=sys.version_info[0]<3 and (lambda x:x) or (lambda x:x.encode('latin1'))
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
from google.protobuf import descriptor_pb2
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='proposal.proto',
  package='',
  syntax='proto3',
  serialized_pb=_b('\n\x0eproposal.proto\"\xb1\x02\n\x08Proposal\x12\x11\n\trecord_id\x18\x01 \x01(\t\x12\x11\n\ttimestamp\x18\x02 \x01(\x04\x12\x15\n\rissuing_agent\x18\x03 \x01(\t\x12\x17\n\x0freceiving_agent\x18\x04 \x01(\t\x12\x1c\n\x04role\x18\x05 \x01(\x0e\x32\x0e.Proposal.Role\x12\x12\n\nproperties\x18\x06 \x03(\t\x12 \n\x06status\x18\x07 \x01(\x0e\x32\x10.Proposal.Status\x12\r\n\x05terms\x18\x08 \x01(\t\".\n\x04Role\x12\t\n\x05OWNER\x10\x00\x12\r\n\tCUSTODIAN\x10\x01\x12\x0c\n\x08REPORTER\x10\x02\"<\n\x06Status\x12\x08\n\x04OPEN\x10\x00\x12\x0c\n\x08\x41\x43\x43\x45PTED\x10\x01\x12\x0c\n\x08REJECTED\x10\x02\x12\x0c\n\x08\x43\x41NCELED\x10\x03\"/\n\x11ProposalContainer\x12\x1a\n\x07\x65ntries\x18\x01 \x03(\x0b\x32\t.Proposalb\x06proto3')
)



_PROPOSAL_ROLE = _descriptor.EnumDescriptor(
  name='Role',
  full_name='Proposal.Role',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='OWNER', index=0, number=0,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='CUSTODIAN', index=1, number=1,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='REPORTER', index=2, number=2,
      options=None,
      type=None),
  ],
  containing_type=None,
  options=None,
  serialized_start=216,
  serialized_end=262,
)
_sym_db.RegisterEnumDescriptor(_PROPOSAL_ROLE)

_PROPOSAL_STATUS = _descriptor.EnumDescriptor(
  name='Status',
  full_name='Proposal.Status',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='OPEN', index=0, number=0,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='ACCEPTED', index=1, number=1,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='REJECTED', index=2, number=2,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='CANCELED', index=3, number=3,
      options=None,
      type=None),
  ],
  containing_type=None,
  options=None,
  serialized_start=264,
  serialized_end=324,
)
_sym_db.RegisterEnumDescriptor(_PROPOSAL_STATUS)


_PROPOSAL = _descriptor.Descriptor(
  name='Proposal',
  full_name='Proposal',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='record_id', full_name='Proposal.record_id', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='timestamp', full_name='Proposal.timestamp', index=1,
      number=2, type=4, cpp_type=4, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='issuing_agent', full_name='Proposal.issuing_agent', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='receiving_agent', full_name='Proposal.receiving_agent', index=3,
      number=4, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='role', full_name='Proposal.role', index=4,
      number=5, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='properties', full_name='Proposal.properties', index=5,
      number=6, type=9, cpp_type=9, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='status', full_name='Proposal.status', index=6,
      number=7, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='terms', full_name='Proposal.terms', index=7,
      number=8, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
    _PROPOSAL_ROLE,
    _PROPOSAL_STATUS,
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=19,
  serialized_end=324,
)


_PROPOSALCONTAINER = _descriptor.Descriptor(
  name='ProposalContainer',
  full_name='ProposalContainer',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='entries', full_name='ProposalContainer.entries', index=0,
      number=1, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=326,
  serialized_end=373,
)

_PROPOSAL.fields_by_name['role'].enum_type = _PROPOSAL_ROLE
_PROPOSAL.fields_by_name['status'].enum_type = _PROPOSAL_STATUS
_PROPOSAL_ROLE.containing_type = _PROPOSAL
_PROPOSAL_STATUS.containing_type = _PROPOSAL
_PROPOSALCONTAINER.fields_by_name['entries'].message_type = _PROPOSAL
DESCRIPTOR.message_types_by_name['Proposal'] = _PROPOSAL
DESCRIPTOR.message_types_by_name['ProposalContainer'] = _PROPOSALCONTAINER
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

Proposal = _reflection.GeneratedProtocolMessageType('Proposal', (_message.Message,), dict(
  DESCRIPTOR = _PROPOSAL,
  __module__ = 'proposal_pb2'
  # @@protoc_insertion_point(class_scope:Proposal)
  ))
_sym_db.RegisterMessage(Proposal)

ProposalContainer = _reflection.GeneratedProtocolMessageType('ProposalContainer', (_message.Message,), dict(
  DESCRIPTOR = _PROPOSALCONTAINER,
  __module__ = 'proposal_pb2'
  # @@protoc_insertion_point(class_scope:ProposalContainer)
  ))
_sym_db.RegisterMessage(ProposalContainer)


# @@protoc_insertion_point(module_scope)
