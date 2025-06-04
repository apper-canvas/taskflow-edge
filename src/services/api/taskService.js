const { ApperClient } = window.ApperSDK;

const taskService = {
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
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'title', 'description', 'status', 'priority', 'due_date', 'created_at', 'updated_at', 'category_id'
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      // Transform the data to match the expected format
      return response.data.map(task => ({
        id: task.Id,
        title: task.title || task.Name,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        category: task.category_id,
        createdAt: task.created_at || task.CreatedOn,
        updatedAt: task.updated_at || task.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'title', 'description', 'status', 'priority', 'due_date', 'created_at', 'updated_at', 'category_id'
        ]
      };

      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const task = response.data;
      return {
        id: task.Id,
        title: task.title || task.Name,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        category: task.category_id,
        createdAt: task.created_at || task.CreatedOn,
        updatedAt: task.updated_at || task.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  },

  async create(taskData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields for creation
      const params = {
        records: [{
          Name: taskData.title,
          title: taskData.title,
          description: taskData.description || '',
          status: taskData.status || 'todo',
          priority: taskData.priority || 'medium',
          due_date: taskData.dueDate || null,
          category_id: taskData.category || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const createdTask = successfulRecords[0].data;
          return {
            id: createdTask.Id,
            title: createdTask.title || createdTask.Name,
            description: createdTask.description,
            status: createdTask.status,
            priority: createdTask.priority,
            dueDate: createdTask.due_date,
            category: createdTask.category_id,
            createdAt: createdTask.created_at,
            updatedAt: createdTask.updated_at
          };
        }
      }
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error);
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

      if (updates.title !== undefined) {
        updateData.Name = updates.title;
        updateData.title = updates.title;
      }
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.category !== undefined) updateData.category_id = updates.category;
      
      updateData.updated_at = new Date().toISOString();

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          return {
            id: updatedTask.Id,
            title: updatedTask.title || updatedTask.Name,
            description: updatedTask.description,
            status: updatedTask.status,
            priority: updatedTask.priority,
            dueDate: updatedTask.due_date,
            category: updatedTask.category_id,
            createdAt: updatedTask.created_at,
            updatedAt: updatedTask.updated_at
          };
        }
      }
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('task', params);
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        if (successfulDeletions.length > 0) {
          return true;
        }
      }
      
      throw new Error('Failed to delete task');
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
};

export default taskService;