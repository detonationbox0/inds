import Table from 'react-bootstrap/Table'
import JobActions from './JobActions'

const JobTable = ({ jobs }) => {

    return (
        <>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Job Id</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job, i) => {
                        return (
                            <tr key={i + 1}>
                                <td width="80px">{job.id}</td>
                                <td width="300px">{job.name}</td>
                                <td>{job.status}</td>
                                <td width="500px">
                                    { /* Only show JobActions if job.status != "Pending" */}
                                    {job.showIcons && <JobActions
                                        files={job.files.sort()}
                                    />}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
    )
}

export default JobTable 
