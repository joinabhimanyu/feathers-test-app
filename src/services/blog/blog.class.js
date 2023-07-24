const { Service } = require('feathers-mongoose');
const mongoose=require('mongoose');
const {ObjectId}=mongoose.Types;

exports.Blog = class Blog extends Service {
    constructor(options, app) {
        super(options);
    }
    async get(id, params) {
        const { query } = params;
        if(id){
            if (query) {
                console.log('query: ', JSON.stringify(query));
                console.log('id: ', id);
                const { target } = query;
                if (target || "" === "comments_length") {
                    const match = {
                        $match: {
                            _id: ObjectId(id)
                        }
                    };
                    const query1 = {
                        $project: {
                            _id: 1,
                            title: 1,
                            author: 1,
                            body: 1,
                            comments: 1,
                            totalComments: {
                                $size: '$comments'
                            },
                            hidden: 1,
                            votes: '$meta.votes',
                            favs: '$meta.favs',
                            createdAt: 1,
                            updatedAt: 1
                        }
                    };
                    const finalQuery=[{ ...match }, { ...query1 }];
                    const s=await this.Model.aggregate(finalQuery).exec();
                    console.log('result: ', JSON.stringify(s));
                    return s;
                }
            }
            return await this.Model.find({_id: ObjectId(id)}).exec();
        }
        return {data:null, message:"Invalid url without id"};
    }
    async create(data, params) {
        if (data) {
            await this.Model.create(data);
            return { data, error: null };
        }
        return { data: null, error: 'Invalid payload' };
    }
    async find(params) {
        const { query } = params;
        if (query) {
            const { author, target } = query;
            if ((target || "") === "comments_length") {
                const query1 = {
                    $project: {
                        _id: 1,
                        title: 1,
                        author: 1,
                        body: 1,
                        comments: 1,
                        totalComments: {
                            $size: '$comments'
                        },
                        hidden: 1,
                        votes: '$meta.votes',
                        favs: '$meta.favs',
                        createdAt: 1,
                        updatedAt: 1
                    }
                };
                let s = await this.Model.aggregate([{ ...query1 }]).exec();
                if (author) {
                    const match = {
                        $match: {
                            author
                        }
                    }
                    s = await this.Model.aggregate([{ ...match }, { ...query1 }]).exec();
                }
                console.log('final result: ', JSON.stringify(s))
                return s;
            }
        }
        return super.find(params);
    }
};
