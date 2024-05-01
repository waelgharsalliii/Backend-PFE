var express = require('express');
var router = express.Router();
const Event=require('../model/event');
const User = require('../model/user');
const Club = require('../model/club');

router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error);
  }
});

router.get('/Loginn', async (req, res) => {
  
    res.status(200).send('Login Page');
  
});

router.get('/:id', async (req, res) => {
  const EventId=req.params.id;
  try {
    const event = await Event.findById(EventId);
    res.json(event);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erreur serveur');
  }
});



const multer = require('multer');
const upload = multer({ dest: 'C:/Users/Amine Barguellil/Desktop/projet pi/Ahmed/CatchApp_The_Innovators/public/img' }); // define upload directory

// Create a new event
router.post('/add',upload.single('img') ,async (req, res) => {
  const { title, description,start,end,location,fee,numPlaces,organizer } = req.body;
  try {
    const event = new Event({
      title,
      description,
      start,
      end,
      location,
      fee,
      numPlaces,
      organizer,
      img: req.file ? req.file.filename : undefined,
    });
      await event.save();
      await Club.updateOne(
        { _id: organizer },
        { $push: { events: event._id } } 
      );
      res.status(201).send(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
  // Update an existing event
router.put('/:id',upload.single('img'), async (req, res) => {
  const { title, description,start,end,location,fee,numPlaces,organizer } = req.body;
    try {
      const updatedEvent = await Event.findOne({ _id: req.params.id });
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      await Club.updateOne(
        { _id: updatedEvent.organizer },
        { $pull: { events: updatedEvent._id } } // Add the event ID to the events array of the club
      );
      updatedEvent.title = title || updatedEvent.title;
      updatedEvent.description = description || updatedEvent.description;
      updatedEvent.start = start || updatedEvent.start;
      updatedEvent.end = end || updatedEvent.end;
      updatedEvent.location = location || updatedEvent.location;
      updatedEvent.fee = fee || updatedEvent.fee;
      updatedEvent.numPlaces = numPlaces || updatedEvent.numPlaces;
      updatedEvent.organizer=organizer || updatedEvent.organizer;
      if (req.file) {
        updatedEvent.img =req.file.filename;
      }
      else {
        updatedEvent.img=undefined;
      }
      await updatedEvent.save()
      await Club.updateOne(
        { _id: organizer },
        { $push: { events: updatedEvent._id } } 
      );
      res.status(200).json(updatedEvent);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
// Delete an existing event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findOne({_id:req.params.id});
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await User.updateMany(
      { _id: { $in: deletedEvent.attendees } }, 
      { $pull: { events: deletedEvent._id } } 
    );
    await Club.updateOne(
      { _id:deletedEvent.organizer },
      { $pull: { events: deletedEvent._id } } // Add the event ID to the events array of the club
    );
    await deletedEvent.deleteOne(); // Update the method to deleteOne()
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

  // Get all upcoming events ordered by date
router.get('/coming', async (req, res) => {
    try {
      const comingEvents = await Event.find({ date: { $gte: new Date() } }).sort({ date: 'asc' });
      res.status(200).json(comingEvents);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });



  router.get('/:id/attendees', async (req, res) => {
    try {
      const event = await Event.findById(req.params.id).populate('attendees');
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event.attendees);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });







  //////////number of attendees
  router.get('/:id/attendees/count', async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json({ count: event.attendees.length });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
//join an event
  router.post('/:eventId/join/:userId', async (req, res) => {
    try {
      // const club = await Club.findById(req.params.clubId);
      // if (!club) {
      //   return res.status(404).json({ message: 'Club not found' });
      // }
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // if (!club.members.includes(user._id)) {
      //   return res.status(400).json({ message: 'User is not a member of this club' });
      // }
      const event = await Event.findById(req.params.eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      if (event.attendees.includes(req.params.userId)) {
        return res.status(400).json({ message: 'User is already attending this event' });
      }
      if (event.numPlaces <= event.attendees.length) {
        return res.status(400).json({ message: 'This event is full' });
      }
      event.attendees.push(req.params.userId);
      await event.save();
      user.events.push(req.params.eventId);
      await user.save();
      res.status(200).json(event);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });


  ////////////////////// Leave Event //////////////////

  router.delete('/:eventId/:userId/leave', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { events: req.params.eventId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
  
      const event = await Event.findByIdAndUpdate(
        req.params.eventId,
        { $pull: { attendees: req.params.userId } },
        { new: true }
      );
      if (!event) {
        return res.status(404).send({ error: 'Event not found' });
      }
  
      res.send({event, user});
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal server error' });
    }
  });
  



  


















module.exports = router;