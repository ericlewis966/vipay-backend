'use strict';
export default class Services {
  static async saveData(model, data) {
    try {
      let saveData = new model(data).save();
      return Promise.resolve(saveData);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getData(model, query, projection, options) {
    try {
      let findData = await model.find(query, projection, options);
      return Promise.resolve(findData);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getDataOne(model, query, projection, options) {
    try {
      let findData = await model.findOne(query, projection, options);
      return Promise.resolve(findData);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getUniqueData(model, query, projection, options, keyName) {
    try {
      let getUniqueData = await model
        .find(query, projection, options)
        .distinct(keyName);
      return Promise.resolve(getUniqueData);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async findAndUpdate(model, conditions, update, options) {
    try {
      let data = await model.findOneAndUpdate(conditions, update, options);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async findAndUpdateWithPopulate(
    model,
    conditions,
    update,
    options,
    populateOptions,
  ) {
    try {
      let data = await model
        .findOneAndUpdate(conditions, update, options)
        .populate(populateOptions);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async update(model, conditions, update, options) {
    try {
      let data = await model.update(conditions, update, options);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async updateOne(model, conditions, update, options) {
    try {
      let data = await model.updateOne(conditions, update, options);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async remove(model, condition) {
    try {
      let data = await model.deleteMany(condition);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async populateData(
    model,
    query,
    projection,
    options,
    collectionOptions,
  ) {
    try {
      let data = await model
        .find(query, projection, options)
        .populate(collectionOptions)
        .exec();
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async populateOneData(
    model,
    query,
    projection,
    options,
    collectionOptions,
  ) {
    try {
      let data = await model
        .findOne(query, projection, options)
        .populate(collectionOptions)
        .exec();
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async deepPopulateData(
    model,
    query,
    projection,
    options,
    collectionOptions,
    populateOptions,
  ) {
    try {
      let data = await model
        .find(query, projection, options)
        .populate(collectionOptions)
        .exec();
      let populateData = await model.populate(data, populateOptions);
      return Promise.resolve(populateData);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async count(model, condition) {
    try {
      let data = await model.countDocuments(condition);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async aggregateData(model, group, options) {
    try {
      let data;
      if (options !== undefined) {
        data = await model.aggregate(group).option(options);
      } else {
        data = await model.aggregate(group);
      }
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async insert(model, data, options) {
    try {
      let data = await model.collection.insert(data, options);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async insertMany(model, insert, options) {
    try {
      let data = await model.collection.insertMany(insert, options);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async bulkFindAndUpdate(bulk, query, update, options) {
    try {
      await bulk.find(query).upsert().update(update, options);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async bulkFindAndUpdateOne(bulk, query, update, options) {
    try {
      await bulk.find(query).upsert().updateOne(update, options);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async aggregateDataWithPopulate(
    model,
    group,
    populateOptions,
    options,
  ) {
    try {
      let aggregateData;
      if (options !== undefined) {
        aggregateData = await model.aggregate(group).option(options);
      } else {
        aggregateData = await model.aggregate(group);
      }
      let populateData = await model.populate(aggregateData, populateOptions);
      return Promise.resolve(populateData);
    } catch (err) {
      console.log(err, 'errerrerr');
      return Promise.reject(err);
    }
  }
}
