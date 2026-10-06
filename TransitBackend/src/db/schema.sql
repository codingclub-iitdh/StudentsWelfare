CREATE TABLE IF NOT EXISTS booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_sub TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    visitors JSONB NOT NULL CHECK (jsonb_typeof(visitors) = 'array'),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_dean'
        CHECK (status IN ('pending_dean', 'denied_by_dean', 'pending_manager', 'denied_by_manager', 'confirmed')),
    terms_accepted BOOLEAN NOT NULL CHECK (terms_accepted = TRUE),
    terms_version TEXT NOT NULL,
    terms_accepted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    room_numbers TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (check_out > check_in)
);

CREATE TABLE IF NOT EXISTS extension_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES booking_requests(id) ON DELETE RESTRICT,
    student_sub TEXT NOT NULL,
    student_email TEXT NOT NULL,
    requested_check_out DATE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_dean'
        CHECK (status IN ('pending_dean', 'denied_by_dean', 'pending_manager', 'denied_by_manager', 'confirmed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS status_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('booking', 'extension')),
    entity_id UUID NOT NULL,
    from_status TEXT,
    to_status TEXT NOT NULL,
    actor_email TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_email TEXT NOT NULL,
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('booking', 'extension')),
    entity_id UUID NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS booking_student_created_idx
    ON booking_requests (student_sub, created_at DESC);
CREATE INDEX IF NOT EXISTS booking_status_created_idx
    ON booking_requests (status, created_at);
CREATE INDEX IF NOT EXISTS extension_student_created_idx
    ON extension_requests (student_sub, created_at DESC);
CREATE INDEX IF NOT EXISTS extension_status_created_idx
    ON extension_requests (status, created_at);
CREATE INDEX IF NOT EXISTS extension_booking_idx
    ON extension_requests (booking_id, created_at DESC);
CREATE INDEX IF NOT EXISTS status_history_entity_idx
    ON status_history (entity_type, entity_id, created_at);
CREATE INDEX IF NOT EXISTS audit_events_entity_idx
    ON audit_events (entity_type, entity_id, created_at);
