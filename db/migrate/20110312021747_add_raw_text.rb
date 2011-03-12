class AddRawText < ActiveRecord::Migration
  def self.up
    add_column :blobs, :raw, :text
  end

  def self.down
    remove_column :blobs, :raw
  end
end
