const { ApperClient } = window.ApperSDK;

const categoryService = {
  getApperClient() {
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  },

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('category', params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      // Transform the data to match the expected format
      return response.data.map(category => ({
        id: category.Id,
        name: category.Name,
        tags: category.Tags,
        owner: category.Owner
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ]
      };

      const response = await apperClient.getRecordById('category', id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const category = response.data;
      return {
        id: category.Id,
        name: category.Name,
        tags: category.Tags,
        owner: category.Owner
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  },

  async create(categoryData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields for creation
      const params = {
        records: [{
          Name: categoryData.name,
          Tags: categoryData.tags || '',
          Owner: categoryData.owner || null
        }]
      };

      const response = await apperClient.createRecord('category', params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const createdCategory = successfulRecords[0].data;
          return {
            id: createdCategory.Id,
            name: createdCategory.Name,
            tags: createdCategory.Tags,
            owner: createdCategory.Owner
          };
        }
      }
      
      throw new Error('Failed to create category');
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields for update
      const updateData = {
        Id: id
      };

      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.tags !== undefined) updateData.Tags = updates.tags;
      if (updates.owner !== undefined) updateData.Owner = updates.owner;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('category', params);
      
      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          const updatedCategory = successfulUpdates[0].data;
          return {
            id: updatedCategory.Id,
            name: updatedCategory.Name,
            tags: updatedCategory.Tags,
            owner: updatedCategory.Owner
          };
        }
      }
      
      throw new Error('Failed to update category');
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('category', params);
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        if (successfulDeletions.length > 0) {
          return true;
        }
      }
      
      throw new Error('Failed to delete category');
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
};

export default categoryService;