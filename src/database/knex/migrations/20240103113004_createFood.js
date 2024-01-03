exports.up = knex =>
  knex.schema
    .createTable('categories', table => {
      table.increments('id')
      table.string('name')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('ingredients', table => {
      table.increments('id')
      table.text('title')
      table.text('description')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('dishes', table => {
      table.increments('id')
      table.string('name')
      table.text('description')
      table.decimal('price')
      table.integer('category_id').unsigned()
      table.foreign('category_id').references('id').inTable('categories')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('orders', table => {
      table.increments('id')
      table.integer('user_id').unsigned()
      table.integer('dish_id').unsigned()
      table.foreign('user_id').references('id').inTable('users')
      table.foreign('dish_id').references('id').inTable('dishes')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('ratings', table => {
      table.increments('id')
      table.integer('user_id').unsigned()
      table.integer('dish_id').unsigned()
      table.integer('rating')
      table.text('comment')
      table.foreign('user_id').references('id').inTable('users')
      table.foreign('dish_id').references('id').inTable('dishes')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })

exports.down = knex =>
  knex.schema
    .dropTableIfExists('ratings')
    .dropTableIfExists('orders')
    .dropTableIfExists('dishes')
    .dropTableIfExists('ingredients')
    .dropTableIfExists('categories')
