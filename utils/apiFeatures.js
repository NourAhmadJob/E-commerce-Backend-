class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStrObj = { ...this.queryString }; // this means that copy the query but withour editing for the orginal
    const excludesFields = ["page", "limit", "sort", "fields"];
    excludesFields.forEach((field) => delete queryStrObj[field]);

    let queryStrings = JSON.stringify(queryStrObj);
    queryStrings = queryStrings.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStrings));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  fieldsLimit() {
    if (this.queryString.fields) {
      const fieldBy = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fieldBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search() {
    if (this.queryString.keywords) {
      const query = {};
      query.$or = [
        { title: { $regex: this.queryString.keywords } },
        { description: { $regex: this.queryString.keywords, $options: "i" } },
      ];
      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
  }
}

module.exports = ApiFeatures;
