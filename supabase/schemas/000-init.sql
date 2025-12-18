-- Create private schema for internal functions not exposed via API
create schema if not exists private;

comment on schema private is 'Internal schema for functions and data not exposed through the public API.';
