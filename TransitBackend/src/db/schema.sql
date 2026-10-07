CREATE TABLE IF NOT EXISTS booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_sub TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_roll_number TEXT NOT NULL DEFAULT '',
    contact_phone TEXT NOT NULL,
    visitors JSONB NOT NULL CHECK (jsonb_typeof(visitors) = 'array'),
    check_in TIMESTAMPTZ NOT NULL,
    check_out TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_dean'
        CHECK (status IN ('pending_dean', 'denied_by_dean', 'pending_manager', 'denied_by_manager', 'confirmed')),
    terms_accepted BOOLEAN NOT NULL CHECK (terms_accepted = TRUE),
    terms_version TEXT NOT NULL,
    terms_accepted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note TEXT NOT NULL DEFAULT '',
    dean_note TEXT NOT NULL DEFAULT '',
    manager_note TEXT NOT NULL DEFAULT '',
    room_numbers TEXT[] NOT NULL DEFAULT '{}',
    room_allocations JSONB NOT NULL DEFAULT '[]'::jsonb
        CHECK (jsonb_typeof(room_allocations) = 'array'),
    facility_block TEXT CHECK (facility_block IN ('mess', 'transit')),
    occupancy TEXT CHECK (occupancy IN ('single', 'double')),
    daily_rate INTEGER CHECK (daily_rate > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (check_out > check_in)
);

CREATE TABLE IF NOT EXISTS extension_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES booking_requests(id) ON DELETE RESTRICT,
    student_sub TEXT NOT NULL,
    student_email TEXT NOT NULL,
    requested_check_out TIMESTAMPTZ NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_dean'
        CHECK (status IN ('pending_dean', 'denied_by_dean', 'pending_manager', 'denied_by_manager', 'confirmed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE booking_requests
    ADD COLUMN IF NOT EXISTS student_roll_number TEXT NOT NULL DEFAULT '';
ALTER TABLE booking_requests
    ADD COLUMN IF NOT EXISTS note TEXT NOT NULL DEFAULT '';
ALTER TABLE booking_requests
    ADD COLUMN IF NOT EXISTS dean_note TEXT NOT NULL DEFAULT '';
ALTER TABLE booking_requests
    ADD COLUMN IF NOT EXISTS manager_note TEXT NOT NULL DEFAULT '';
ALTER TABLE booking_requests
    ADD COLUMN IF NOT EXISTS room_allocations JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE booking_requests
    ADD COLUMN IF NOT EXISTS facility_block TEXT CHECK (facility_block IN ('mess', 'transit'));
ALTER TABLE booking_requests
    ADD COLUMN IF NOT EXISTS occupancy TEXT CHECK (occupancy IN ('single', 'double'));
ALTER TABLE booking_requests
    ADD COLUMN IF NOT EXISTS daily_rate INTEGER CHECK (daily_rate > 0);

DO $migration$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'booking_requests'
          AND column_name = 'check_in'
          AND data_type = 'date'
    ) THEN
        ALTER TABLE booking_requests
            ALTER COLUMN check_in TYPE TIMESTAMPTZ
            USING check_in::timestamp AT TIME ZONE 'Asia/Kolkata';
        ALTER TABLE booking_requests
            ALTER COLUMN check_out TYPE TIMESTAMPTZ
            USING check_out::timestamp AT TIME ZONE 'Asia/Kolkata';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'extension_requests'
          AND column_name = 'requested_check_out'
          AND data_type = 'date'
    ) THEN
        ALTER TABLE extension_requests
            ALTER COLUMN requested_check_out TYPE TIMESTAMPTZ
            USING requested_check_out::timestamp AT TIME ZONE 'Asia/Kolkata';
    END IF;
END
$migration$;

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
