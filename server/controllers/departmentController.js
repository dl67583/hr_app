const { Department } = require('../models'); 


exports.createDepartment = async (req, res) => {
  const {name} = req.body

  try {
    if (!name ) {
      return res.status(400).json({ message: ' name is required' });
    }  
      if (await Department.findOne({ where:  {name:name}  })) {
        return res.status(400).json({ message: 'name address already exists' });
      }
      const requestBody = Object.fromEntries(
        Object.entries(req.body).map(([key, value]) => [key, value === "" ? undefined : value])
      );
      res.send("<script>alert("+requestBody+")</script>")
    const department = await Department.create(requestBody);
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateDepartmentById = async (req, res) => {
  const {name} = req.body

  try {
    
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    if (!name ) {
      return res.status(400).json({ message: ' name is required' });
    }  
      if (await Department.findOne({ where:  {name:name}  })) {
        return res.status(400).json({ message: 'name address already exists' });
      }
      const requestBody = Object.fromEntries(
        Object.entries(requestBody).map(([key, value]) => [key, value === "" ? undefined : value])
      );
    await department.update(req.body);
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    await department.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
