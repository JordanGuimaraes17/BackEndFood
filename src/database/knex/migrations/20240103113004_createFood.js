exports.up = knex =>
  knex.schema
    .createTable('categories', table => {
      table.increments('id')
      table.string('name')
      table.string('avatar').nullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })

    .createTable('dishes', table => {
      table.increments('id')
      table.string('name')
      table.text('description')
      table.decimal('price')
      table.string('avatar').nullable()
      table.integer('category_id').unsigned()
      table.foreign('category_id').references('id').inTable('categories')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })

    .createTable('orders', table => {
      table.increments('id')
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('id').inTable('users')
      table.integer('total_quantity').defaultTo(0)
      table.decimal('total_price', 10, 2).defaultTo(0)
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })

    .createTable('order_dishes', table => {
      table.increments('id')
      table.integer('order_id').unsigned()
      table.integer('dish_id').unsigned()
      table.integer('quantity').defaultTo(1)
      table.decimal('dish_price', 10, 2).defaultTo(0)
      table.foreign('order_id').references('id').inTable('orders')
      table.foreign('dish_id').references('id').inTable('dishes')
    })

    .createTable('ratings', table => {
      table.increments('id')
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('id').inTable('users')
      table.integer('dish_id').unsigned()
      table.foreign('dish_id').references('id').inTable('dishes')
      table.integer('rating')
      table.text('comment')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })

exports.down = knex =>
  knex.schema
    .dropTableIfExists('ratings')
    .dropTableIfExists('order_dishes')
    .dropTableIfExists('orders')
    .dropTableIfExists('dishes')
    .dropTableIfExists('categories')
