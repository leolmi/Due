/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');
var _STEP_COUNT = 10;

var getThings = function(params, next) {
  var now = new Date().getTime();
  //console.log('getThings - params.prev='+params.prev);
  var filter = params.prev ?
    {owner:params.user_id, $where : "this.due_date.getTime() < "+now } :
    {owner:params.user_id, $where : "this.due_date.getTime() >= "+now };
  var sort_type = params.prev ? 'desc' : 'asc';

  //console.log('filter:'+JSON.stringify(filter)+'  sort:'+sort_type);

  Thing.find(filter).sort({due_date: sort_type}).exec(function (err, things) {
    //console.log('fatto:'+err);
    if(err) next(err);
    else {
      //console.log('trovati: '+things.length+' elementi');
      var result = undefined;
      if (params.element_id){
        var index = getIndexOf(things, params.element_id);
        //console.log('indice elemento: '+index);
        if (index>=0 && things.length>index+1)
          result = things.slice(index+1, index+1+_STEP_COUNT);
      }
      else{
        //console.log('effettua lo slice');
        result = things.slice(0, _STEP_COUNT);
        //console.log('in fine: '+result.length+' elementi');
      }
      next(undefined, result);
    }
  });
};

var getIndexOf = function(array, id) {
  for(var i=0, max=array.length; i < max; i++) {
    //console.log('array[i]: '+array[i]._id+'      id:'+id);
    if(array[i]._id == id) {
      return i;
      break;
    }
  }
}


var getParams = function(req) {
  return {
    user_id: req.user._id,
    step: req.params.step ? req.params.step : _STEP_COUNT,
    element_id: req.params.id,
    prev: (req.params.prev && req.params.prev.toString()=='true') ? true : false
  };
};

// Get list of things
exports.index = function(req, res) {
  var things = [];
  var params = getParams(req);
  //console.log('params:'+JSON.stringify(params));
  getThings(params, function(err, things_next) {
    if (err) return handleError(res, err);
    things.push.apply(things, things_next);
    //console.log('things next:'+things);
    params.prev = true;
    getThings(params, function(err, things_prev) {
      if (err) return handleError(res, err);
      things.push.apply(things, things_prev);
      //console.log('things next e prev:'+things);
      return res.json(200, things);
    });
  });
};

exports.step = function(req, res) {
  var params = getParams(req);
  getThings(params, function(err, things) {
    if (err) return handleError(res, err);
    return res.json(200, things);
  });
};

// Get a single thing
exports.show = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  var uid = req.user._id;
  console.log('[create] - ID utente:'+uid);
  req.body.owner = uid;
  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body, function(a,b) {
      return _.isArray(a) ? b : undefined;
    });
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(202, thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
