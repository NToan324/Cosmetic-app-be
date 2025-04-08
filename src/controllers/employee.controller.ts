import { Request, Response } from 'express'
import employeeService from '@/services/employee.service'

class EmployeeController {
  async getAllEmployees(req: Request, res: Response) {
    res.send(await employeeService.getAllEmployees())
  }

  async getEmployeeById(req: Request, res: Response) {
    const { id } = req.params
    res.send(await employeeService.getEmployeeById(id))
  }

  async createEmployee(req: Request, res: Response) {
    const { id } = req.user as { id: string }
    const payload = req.body
    res.send(await employeeService.createEmployee({ payload, id }))
  }

  async updateEmployee(req: Request, res: Response) {
    const { id } = req.user as { id: string }
    const employeeId = req.params.id
    const payload = req.body

    res.send(await employeeService.updateEmployee({ payload, id, employeeId }))
  }

  async deleteEmployee(req: Request, res: Response) {
    const { id } = req.user as { id: string }
    const employeeId = req.params.id
    res.send(await employeeService.deleteEmployee({ id, employeeId }))
  }
}

const employeeController = new EmployeeController()
export default employeeController
