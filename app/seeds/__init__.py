from flask.cli import AppGroup
from .users import seed_users, undo_users
from .songs import seed_songs, undo_songs
from .tracks import seed_tracks, undo_tracks
from .samples import seed_samples, undo_samples
from .instruments import seed_instruments, undo_instruments

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_tracks()
        undo_samples()
        undo_instruments()
        undo_songs()
        undo_users()
        
    seed_users()
    seed_songs()
    seed_instruments()
    seed_samples()
    seed_tracks()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_tracks()
    undo_samples()
    undo_instruments()
    undo_songs()
    undo_users()
    # Add other undo functions here