FROM postgres:9.6.1

# Ref: https://hub.docker.com/_/postgres/

# Create the locale, ja_JP.UTF-8
RUN localedef -i ja_JP -c -f UTF-8 -A /usr/share/locale/locale.alias ja_JP.UTF-8
ENV LANG en_US.utf8

# Init database by sql files.
COPY ./bootstrap.sql /docker-entrypoint-initdb.d/
