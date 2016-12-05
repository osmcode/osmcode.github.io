---
chapter: 4
title: Format Overview
---

_Some lines have been broken in this description for easier reading, in the
file format they are not._

    NODE:
        n(OBJECT_ID) v(VERSION) d(V|D) c(CHANGESET_ID) t(yyyy-mm-ddThh:mm:ssZ)
        i(USER_ID) u(USERNAME) T(TAGS) x(LONGITUDE) y(LATITUDE)

    WAY:
        w(OBJECT_ID) v(VERSION) d(V|D) c(CHANGESET_ID) t(yyyy-mm-ddThh:mm:ssZ)
        i(USER_ID) u(USERNAME) T(TAGS) N(WAY_NODES)

    RELATION:
        r(OBJECT_ID) v(VERSION) d(V|D) c(CHANGESET_ID) t(yyyy-mm-ddThh:mm:ssZ)
        i(USER_ID) u(USERNAME) T(TAGS) M(MEMBERS)

    CHANGESET:
        c(CHANGESET_ID) k(NUM_CHANGES) s(yyyy-mm-ddThh:mm:ssZ) e(yyyy-mm-ddThh:mm:ssZ)
        d(NUM_COMMENTS) i(USER_ID) u(USERNAME)
        x(LONGITUDE) y(LATITUDE) X(LONGITUDE) Y(LATITUDE) T(TAGS)

    TAGS
        (KEY)=(VALUE),...

    WAY_NODES:
        n(NODE_REF),...

    MEMBERS:
        [nwr](MEMBER_REF)@(MEMBER_ROLE),...


